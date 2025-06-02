export interface Webhook {
  id: string;
  name: string;
  url: string;
  events: string[];
  isActive: boolean;
  secret?: string;
  dateCreated: string;
  dateUpdated?: string;
}

export interface CreateWebhookRequest {
  name: string;
  url: string;
  events: string[];
  secret?: string;
}

export interface UpdateWebhookRequest {
  name?: string;
  url?: string;
  events?: string[];
  secret?: string;
  isActive?: boolean;
}

export interface WebhookEvent {
  id: string;
  webhookId: string;
  event: string;
  data: any;
  status: 'Pending' | 'Delivered' | 'Failed';
  attempts: number;
  dateCreated: string;
  dateDelivered?: string;
}
