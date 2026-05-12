export interface FolderItem {
  id: string;
  name: string;
  count: number;
  children?: FolderItem[];
}

export interface Document {
  id: string;
  name: string;
  date: string;
  version: string;
  type: 'pdf' | 'docx' | 'xlsx' | 'email' | 'img';
  hasVersions?: boolean;
  sender?: string;
  subject?: string;
  preview?: string;
  size?: string;
}

export const folders: FolderItem[] = [
  { id: 'secure-test', name: 'SecureTest', count: 1989 },
  { id: 'trouve-day-mail', name: 'TrouveDayMail', count: 1890 },
  { id: 'accountancy2020', name: 'Accountancy2020', count: 520091 },
  { id: 'accountancy2021', name: 'Accountancy2021', count: 500000 },
  { id: 'accountancy2022', name: 'Accountancy2022', count: 500000 },
  { id: 'accountancy2023', name: 'Accountancy2023', count: 500000 },
  { id: 'accountancy2024', name: 'Accountancy2024', count: 435404 },
  { id: 'accountancy2025', name: 'Accountancy2025', count: 816249 },
  { id: 'acc2024', name: 'ACC2024', count: 1439 },
  { id: 'acc2023', name: 'ACC2023', count: 26308 },
  { id: 'simon-testing-new', name: 'simonTestingNew', count: 5 },
  { id: 'voorblad', name: 'VoorbladDigitaalArchief', count: 13 },
  { id: 'autotransport', name: 'Autotransport', count: 6 },
  {
    id: 'tree1', name: 'Tree1', count: 0, children: [
      { id: 'subtree1', name: 'SubTree1', count: 0 },
      { id: 'tree2', name: 'Tree2', count: 1 },
    ]
  },
  { id: 'new-demo-class', name: 'New_Demo_Class', count: 6 },
  { id: 'private', name: 'PRIVATE', count: 5 },
  { id: 'cpa', name: 'CPA', count: 12 },
  { id: 'newcorp', name: 'NewCorp', count: 35 },
  {
    id: 'clarity-capital', name: 'Clarity Capital', count: 1, children: [
      { id: 'clarity-invoices', name: 'Clarity Capital Invoices', count: 1 },
      { id: 'clarity-hr', name: 'Clarity Capital HR', count: 0 },
      { id: 'clarity-cert', name: 'Clarity Capital Certificates', count: 0 },
    ]
  },
  {
    id: 'apicem-investments', name: 'Apicem Investments', count: 13, children: [
      { id: 'apicem-invoices', name: 'Apicem Investments Invoices', count: 13 },
      { id: 'apicem-hr', name: 'Apicem Investments HR', count: 0 },
      { id: 'apicem-cert', name: 'Apicem Investments Certificates', count: 0 },
    ]
  },
  { id: 'apicem-management', name: 'Apicem Management', count: 5 },
];

export const secureTestDocuments: Document[] = [
  { id: '1131692', name: 'Merged_SL.pdf', date: 'Thu 09-10', version: '1.0', type: 'pdf', size: '245 KB' },
  { id: '1131690', name: 'sample4 (2).docx', date: 'Thu 09-10', version: '1.0', type: 'docx', size: '128 KB' },
  { id: '1131688', name: 'apicam-dummy-pdf - Copy (6).pdf', date: 'Wed 08-10', version: '1.1.1', type: 'pdf', hasVersions: true, size: '512 KB' },
  { id: '1131687', name: 'ssss.pdf', date: 'Wed 08-10', version: '1.1', type: 'pdf', hasVersions: true, size: '98 KB' },
  { id: '1131686', name: 'test-document-final.pdf', date: 'Wed 08-10', version: '1.0', type: 'pdf', size: '320 KB' },
  { id: '1131685', name: 'invoice_2024_Q3.xlsx', date: 'Tue 07-10', version: '2.0', type: 'xlsx', hasVersions: true, size: '87 KB' },
  { id: '1131684', name: 'contract_signed.pdf', date: 'Mon 06-10', version: '1.0', type: 'pdf', size: '1.2 MB' },
  { id: '1131683', name: 'report_annual.docx', date: 'Mon 06-10', version: '3.1', type: 'docx', hasVersions: true, size: '445 KB' },
  { id: '1131682', name: 'scan_20241006.pdf', date: 'Sun 05-10', version: '1.0', type: 'pdf', size: '2.1 MB' },
  { id: '1131681', name: 'budget_forecast.xlsx', date: 'Fri 04-10', version: '1.2', type: 'xlsx', hasVersions: true, size: '156 KB' },
  { id: '1131680', name: 'meeting_notes_board.docx', date: 'Thu 03-10', version: '1.0', type: 'docx', size: '78 KB' },
  { id: '1131679', name: 'vendor_agreement.pdf', date: 'Wed 02-10', version: '2.1', type: 'pdf', hasVersions: true, size: '890 KB' },
];

export const trouveDayMailDocuments: Document[] = [
  { id: 'tdf-001', name: 'Privacy Policy Update', sender: 'Grammarly', subject: 'We updated our Privacy Policy...', preview: 'Grammarly, Coda, and Superhum...', date: 'Mon 10-11', type: 'email', version: '1.0' },
  { id: 'tdf-002', name: 'AvePoint Technical Support', sender: 'Pieter Korteweg', subject: 'Re: AvePoint Technical Support...', preview: 'Hi Cyl, Thanks for the answer! Every...', date: 'Mon 10-11', type: 'email', version: '1.0' },
  { id: 'tdf-003', name: 'AvePoint Technical Support', sender: 'Cyl Borbon', subject: 'Re: AvePoint Technical Support...', preview: 'Hello Pieter, Thank you very much f...', date: 'Sat 08-11', type: 'email', version: '1.0' },
  { id: 'tdf-004', name: 'AvePoint Technical Support', sender: 'Pieter Korteweg', subject: 'Re: AvePoint Technical Support...', preview: 'Hi Cyl, Thanks for reaching out here...', date: 'Sat 08-11', type: 'email', version: '1.0' },
  { id: 'tdf-005', name: 'AvePoint Technical Support Ca...', sender: 'Cyl Borbon', subject: 'AvePoint Technical Support Ca...', preview: 'Hello Pieter, Thank you for contacti...', date: 'Fri 07-11', type: 'email', version: '1.0' },
  { id: 'tdf-006', name: 'Q4 Newsletter', sender: 'DocuVibes Team', subject: 'Your Q4 Newsletter is here!', preview: 'Check out all the updates we have...', date: 'Thu 06-11', type: 'email', version: '1.0' },
  { id: 'tdf-007', name: 'System Maintenance Notice', sender: 'IT Department', subject: 'Scheduled Maintenance: Nov 12', preview: 'Dear user, we will be performing...', date: 'Wed 05-11', type: 'email', version: '1.0' },
  { id: 'tdf-008', name: 'Project Update - Phase 2', sender: 'Sarah Müller', subject: 'Re: Project Atlas - Phase 2 Update', preview: 'Hi Team, I wanted to share the latest...', date: 'Tue 04-11', type: 'email', version: '1.0' },
];

export const controlPanelCards = [
  { id: 'company', title: 'Company Management', icon: 'Building2', description: 'Manage company settings and structure', color: 'indigo' },
  { id: 'permissions', title: 'Permissions Management', icon: 'ShieldCheck', description: 'Configure user access and roles', color: 'violet' },
  { id: 'permission-group', title: 'Permission Group Management', icon: 'Users', description: 'Manage permission groups', color: 'blue' },
  { id: 'document-class', title: 'Document Class Management', icon: 'FolderKanban', description: 'Organize document classification', color: 'cyan' },
  { id: 'connectors', title: 'Connectors Configuration', icon: 'Plug', description: 'Configure external connectors', color: 'teal' },
  { id: 'user-group', title: 'User Group Management', icon: 'UserCog', description: 'Manage user groups and teams', color: 'emerald' },
  { id: 'scheduler-logs', title: 'Document Scheduler Logs', icon: 'Clock', description: 'View scheduled task history', color: 'amber' },
  { id: 'text-extraction', title: 'Text Extraction Logs', icon: 'FileSearch', description: 'Monitor OCR and extraction jobs', color: 'orange' },
  { id: 'advanced-search-fields', title: 'Configure Advance Search Fields', icon: 'SlidersHorizontal', description: 'Customize advanced search parameters', color: 'pink' },
  { id: 'mail-server', title: 'Configure Mail Server Details', icon: 'Mail', description: 'Set up email server configuration', color: 'rose' },
  { id: 'workflow', title: 'WorkFlow Management', icon: 'GitBranch', description: 'Design and manage workflows', color: 'purple' },
  { id: 'deletion-logs', title: 'Document Deletion Logs', icon: 'Trash2', description: 'Track deleted document history', color: 'red' },
  { id: 'address-book', title: 'Address Book Groups', icon: 'BookUser', description: 'Manage contact address groups', color: 'slate' },
];

export const documentClasses = [
  'SecureTest', 'TrouveDayMail', 'Accountancy2020', 'Accountancy2021',
  'Accountancy2022', 'Accountancy2023', 'Accountancy2024', 'Accountancy2025',
  'ACC2024', 'ACC2023', 'PRIVATE', 'CPA', 'NewCorp'
];

export const versionTree = {
  name: 'ddd.pdf',
  version: 'version-1.0',
  children: [
    {
      name: 'version-1.1',
      children: [
        { name: 'version-1.1.1', children: [] }
      ]
    }
  ]
};

export const searchResults: { group: string; docs: Document[] }[] = [
  {
    group: 'Docuvibes_CPA',
    docs: [
      { id: '4445908', name: 'Migratie Invu naar Docuvibes.docx', date: '', version: 'v1.0', type: 'docx', size: '1.2 MB' },
    ]
  },
  {
    group: 'CPA_Test',
    docs: [
      { id: '4445889', name: 'demo_dummy-pdf.pdf', date: '', version: 'v1.0', type: 'pdf', size: '890 KB' },
    ]
  }
];
