export interface Policy {
  id: string;
  name: string;
  description?: string;
  isActive: boolean;
  rules: PolicyRule[];
  dateCreated: string;
  dateUpdated?: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  condition: any;
  action: 'Allow' | 'Deny' | 'RequireApproval';
  priority: number;
}

export interface ApprovalRequest {
  id: string;
  policyId: string;
  requestType: string;
  requestData: any;
  status: 'Pending' | 'Approved' | 'Rejected';
  requester: {
    userId: string;
    appId: string;
  };
  approvers: Array<{
    userId: string;
    decision: 'Approved' | 'Rejected';
    dateDecided: string;
  }>;
  dateCreated: string;
  dateResolved?: string;
}
