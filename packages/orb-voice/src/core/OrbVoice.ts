/**
 * ORB Voice Orchestrator
 * Contrôle vocal pour génération et manipulation d'interfaces
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

export interface OrbVoiceConfig {
  apiKey: string;
  model?: string;
  language?: string;
  wakeWord?: string;
  onTranscript?: (text: string) => void;
  onIntent?: (intent: string) => void;
  onAction?: (action: VoiceAction) => void;
  onError?: (error: Error) => void;
}

export interface VoiceAction {
  type: 'generate_ui' | 'click' | 'fill_form' | 'navigate' | 'speak';
  target?: string;
  params?: Record<string, any>;
}

export class OrbVoice {
  private config: OrbVoiceConfig;
  private genAI: GoogleGenerativeAI;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private isListening = false;
  private recognition: any = null; // SpeechRecognition

  constructor(config: OrbVoiceConfig) {
    this.config = {
      model: 'gemini-2.0-flash-exp',
      language: 'fr-FR',
      wakeWord: 'orb',
      ...config,
    };
    
    this.genAI = new GoogleGenerativeAI(this.config.apiKey);
    this.initSpeechRecognition();
  }

  /**
   * Initialiser la reconnaissance vocale
   */
  private initSpeechRecognition() {
    if (typeof window === 'undefined') return;

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn('Speech Recognition not supported');
      return;
    }

    this.recognition = new SpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.lang = this.config.language;

    this.recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join('');

      this.config.onTranscript?.(transcript);
      this.processTranscript(transcript);
    };

    this.recognition.onerror = (event: any) => {
      this.config.onError?.(new Error(event.error));
    };
  }

  /**
   * Démarrer l'écoute
   */
  async startListening(): Promise<void> {
    if (this.isListening) return;

    try {
      if (this.recognition) {
        this.recognition.start();
      } else {
        // Fallback: utiliser MediaRecorder
        await this.startMediaRecording();
      }
      
      this.isListening = true;
      console.log('🎤 ORB Voice: Écoute activée');
    } catch (error) {
      this.config.onError?.(error as Error);
      throw error;
    }
  }

  /**
   * Arrêter l'écoute
   */
  stopListening(): void {
    if (!this.isListening) return;

    if (this.recognition) {
      this.recognition.stop();
    }
    
    if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
      this.mediaRecorder.stop();
    }

    this.isListening = false;
    console.log('🎤 ORB Voice: Écoute désactivée');
  }

  /**
   * Démarrer l'enregistrement audio
   */
  private async startMediaRecording(): Promise<void> {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.mediaRecorder = new MediaRecorder(stream);

    this.mediaRecorder.ondataavailable = (event) => {
      this.audioChunks.push(event.data);
    };

    this.mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
      this.audioChunks = [];
      await this.transcribeAudio(audioBlob);
    };

    this.mediaRecorder.start();
  }

  /**
   * Transcrire l'audio avec Gemini
   */
  private async transcribeAudio(audioBlob: Blob): Promise<void> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.config.model! });
      
      // Convertir le blob en base64
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      
      reader.onloadend = async () => {
        const base64Audio = reader.result as string;
        
        const result = await model.generateContent([
          {
            inlineData: {
              mimeType: 'audio/webm',
              data: base64Audio.split(',')[1],
            },
          },
          { text: 'Transcris cet audio en texte.' },
        ]);

        const transcript = result.response.text();
        this.config.onTranscript?.(transcript);
        await this.processTranscript(transcript);
      };
    } catch (error) {
      this.config.onError?.(error as Error);
    }
  }

  /**
   * Traiter la transcription
   */
  private async processTranscript(transcript: string): Promise<void> {
    const lowerTranscript = transcript.toLowerCase();

    // Vérifier le wake word
    if (this.config.wakeWord && !lowerTranscript.includes(this.config.wakeWord)) {
      return;
    }

    // Extraire l'intention
    const intent = this.extractIntent(transcript);
    this.config.onIntent?.(intent);

    // Générer l'action
    const action = await this.generateAction(intent);
    if (action) {
      this.config.onAction?.(action);
      await this.executeAction(action);
    }
  }

  /**
   * Extraire l'intention de la transcription
   */
  private extractIntent(transcript: string): string {
    // Retirer le wake word
    let intent = transcript.toLowerCase();
    if (this.config.wakeWord) {
      intent = intent.replace(this.config.wakeWord, '').trim();
    }
    return intent;
  }

  /**
   * Générer une action à partir de l'intention
   */
  private async generateAction(intent: string): Promise<VoiceAction | null> {
    try {
      const model = this.genAI.getGenerativeModel({ model: this.config.model! });

      const prompt = `Tu es un assistant vocal qui contrôle une interface utilisateur.
      
Analyse cette commande vocale et génère une action JSON:
"${intent}"

Actions possibles:
- generate_ui: Générer une nouvelle interface
- click: Cliquer sur un élément
- fill_form: Remplir un formulaire
- navigate: Naviguer vers une page
- speak: Répondre vocalement

Réponds UNIQUEMENT avec un JSON au format:
{
  "type": "generate_ui",
  "target": "formulaire de contact",
  "params": {}
}`;

      const result = await model.generateContent(prompt);
      const response = result.response.text();
      
      // Extraire le JSON de la réponse
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      
      return null;
    } catch (error) {
      this.config.onError?.(error as Error);
      return null;
    }
  }

  /**
   * Exécuter une action
   */
  private async executeAction(action: VoiceAction): Promise<void> {
    console.log('🎬 Exécution de l\'action:', action);

    switch (action.type) {
      case 'generate_ui':
        // L'action sera gérée par le callback onAction
        break;

      case 'click':
        if (action.target) {
          const element = document.querySelector(action.target);
          if (element instanceof HTMLElement) {
            element.click();
          }
        }
        break;

      case 'fill_form':
        if (action.params) {
          Object.entries(action.params).forEach(([name, value]) => {
            const input = document.querySelector(`[name="${name}"]`) as HTMLInputElement;
            if (input) {
              input.value = String(value);
            }
          });
        }
        break;

      case 'navigate':
        if (action.target) {
          window.location.href = action.target;
        }
        break;

      case 'speak':
        if (action.params?.text) {
          await this.speak(action.params.text);
        }
        break;
    }
  }

  /**
   * Synthèse vocale
   */
  async speak(text: string): Promise<void> {
    if (typeof window === 'undefined' || !window.speechSynthesis) {
      console.warn('Speech Synthesis not supported');
      return;
    }

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.config.language!;
      utterance.onend = () => resolve();
      
      window.speechSynthesis.speak(utterance);
    });
  }

  /**
   * Vérifier si l'écoute est active
   */
  isActive(): boolean {
    return this.isListening;
  }

  /**
   * Détruire l'instance
   */
  destroy(): void {
    this.stopListening();
    if (this.recognition) {
      this.recognition = null;
    }
  }
}
