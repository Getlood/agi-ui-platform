import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';
import './DataTable';

const meta: Meta = {
  title: 'Organisms/DataTable',
  component: 'agi-datatable',
  tags: ['autodocs'],
  argTypes: {
    selectable: { control: 'boolean' },
    pagination: { control: 'boolean' },
    pageSize: { control: 'number' },
    sortable: { control: 'boolean' },
    filterable: { control: 'boolean' },
  },
};

export default meta;
type Story = StoryObj;

const sampleData = [
  { id: 1, name: 'Alice Martin', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Dupont', email: 'bob@example.com', role: 'User', status: 'Active' },
  { id: 3, name: 'Charlie Bernard', email: 'charlie@example.com', role: 'User', status: 'Inactive' },
  { id: 4, name: 'Diana Petit', email: 'diana@example.com', role: 'Manager', status: 'Active' },
  { id: 5, name: 'Eve Laurent', email: 'eve@example.com', role: 'User', status: 'Active' },
  { id: 6, name: 'Frank Moreau', email: 'frank@example.com', role: 'Admin', status: 'Active' },
  { id: 7, name: 'Grace Simon', email: 'grace@example.com', role: 'User', status: 'Inactive' },
  { id: 8, name: 'Henry Michel', email: 'henry@example.com', role: 'Manager', status: 'Active' },
  { id: 9, name: 'Iris Leroy', email: 'iris@example.com', role: 'User', status: 'Active' },
  { id: 10, name: 'Jack Garnier', email: 'jack@example.com', role: 'User', status: 'Active' },
];

const columns = [
  { key: 'id', label: 'ID', width: '80px', sortable: true },
  { key: 'name', label: 'Nom', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'role', label: 'Rôle', sortable: true },
  { 
    key: 'status', 
    label: 'Statut',
    sortable: true,
    render: (value: string) => {
      const color = value === 'Active' ? '#10b981' : '#6b7280';
      return html\`<span style="color: \${color}; font-weight: 600;">\${value}</span>\`;
    }
  },
];

export const Default: Story = {
  render: () => html\`
    <agi-datatable
      .columns=\${columns}
      .data=\${sampleData}
      selectable
      pagination
      pageSize="5"
    ></agi-datatable>
  \`,
};

export const WithoutPagination: Story = {
  render: () => html\`
    <agi-datatable
      .columns=\${columns}
      .data=\${sampleData}
      ?pagination=\${false}
    ></agi-datatable>
  \`,
};

export const WithSelection: Story = {
  render: () => html\`
    <agi-datatable
      .columns=\${columns}
      .data=\${sampleData}
      selectable
      @selection-change=\${(e: CustomEvent) => {
        console.log('Selected rows:', e.detail.selected);
      }}
    ></agi-datatable>
  \`,
};

export const WithoutFiltering: Story = {
  render: () => html\`
    <agi-datatable
      .columns=\${columns}
      .data=\${sampleData}
      ?filterable=\${false}
      pagination
      pageSize="5"
    ></agi-datatable>
  \`,
};
