export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'email' | 'date' | 'number' | 'textarea' | 'select';
  placeholder?: string;
  required?: boolean;
  options?: string[];
  description?: string;
}

export interface Template {
  id: string;
  title: string;
  category: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  tags: string[];
  fields: TemplateField[];
  generateDocument: (data: Record<string, string>) => string;
}

export const templateCategories = [
  'All Templates',
  'Employment',
  'Business Contracts',
  'Real Estate',
  'Non-Disclosure',
  'Services',
  'Personal',
] as const;

export const templates: Template[] = [
  {
    id: 'nda-basic',
    title: 'Non-Disclosure Agreement (NDA)',
    category: 'Non-Disclosure',
    description: 'A basic mutual NDA to protect confidential information shared between two parties.',
    difficulty: 'beginner',
    estimatedTime: '5 minutes',
    tags: ['confidentiality', 'mutual', 'business'],
    fields: [
      {
        id: 'party1Name',
        label: 'First Party Name',
        type: 'text',
        placeholder: 'Company A Inc.',
        required: true,
        description: 'Legal name of the first party',
      },
      {
        id: 'party1Address',
        label: 'First Party Address',
        type: 'textarea',
        placeholder: '123 Business St, City, State, ZIP',
        required: true,
      },
      {
        id: 'party2Name',
        label: 'Second Party Name',
        type: 'text',
        placeholder: 'Company B LLC',
        required: true,
        description: 'Legal name of the second party',
      },
      {
        id: 'party2Address',
        label: 'Second Party Address',
        type: 'textarea',
        placeholder: '456 Commerce Ave, City, State, ZIP',
        required: true,
      },
      {
        id: 'effectiveDate',
        label: 'Effective Date',
        type: 'date',
        required: true,
      },
      {
        id: 'duration',
        label: 'Agreement Duration (years)',
        type: 'select',
        options: ['1', '2', '3', '5', '10'],
        required: true,
      },
      {
        id: 'purposeDescription',
        label: 'Purpose of Disclosure',
        type: 'textarea',
        placeholder: 'Describe the purpose for sharing confidential information...',
        required: true,
      },
    ],
    generateDocument: (data) => `
MUTUAL NON-DISCLOSURE AGREEMENT

This Mutual Non-Disclosure Agreement (the "Agreement") is entered into as of ${data.effectiveDate} (the "Effective Date"), by and between:

FIRST PARTY:
${data.party1Name}
${data.party1Address}

AND

SECOND PARTY:
${data.party2Name}
${data.party2Address}

(Each a "Party" and collectively the "Parties")

RECITALS

WHEREAS, the Parties wish to explore a business opportunity of mutual interest and in connection with this opportunity, each Party may disclose to the other certain confidential technical and business information that the disclosing Party desires the receiving Party to treat as confidential.

NOW, THEREFORE, in consideration of the mutual covenants and agreements contained herein, and for other good and valuable consideration, the receipt and sufficiency of which are hereby acknowledged, the Parties agree as follows:

1. PURPOSE

The purpose of this Agreement is to facilitate discussions and exchange of information between the Parties concerning: ${data.purposeDescription}

2. CONFIDENTIAL INFORMATION

"Confidential Information" means any information disclosed by either Party to the other Party, either directly or indirectly, in writing, orally, or by inspection of tangible objects, including without limitation documents, business plans, source code, software, documentation, financial information, and any other proprietary information.

3. OBLIGATIONS

Each Party agrees to:
a) Hold and maintain the Confidential Information in strict confidence;
b) Use the Confidential Information solely for the Purpose stated above;
c) Not disclose the Confidential Information to any third parties without prior written consent;
d) Protect the Confidential Information using the same degree of care used to protect its own confidential information;
e) Limit access to the Confidential Information to employees and contractors who have a legitimate need to know.

4. EXCLUSIONS

Confidential Information shall not include information that:
a) Was publicly known at the time of disclosure;
b) Becomes publicly known through no breach of this Agreement;
c) Was rightfully in the receiving Party's possession prior to disclosure;
d) Is independently developed by the receiving Party without use of the Confidential Information;
e) Is rightfully received by the receiving Party from a third party without breach of confidentiality.

5. TERM

This Agreement shall remain in effect for a period of ${data.duration} year(s) from the Effective Date. The obligations of confidentiality shall survive the termination of this Agreement.

6. RETURN OF MATERIALS

Upon termination or at the request of the disclosing Party, the receiving Party shall promptly return or destroy all Confidential Information and certify in writing that such return or destruction has been completed.

7. NO LICENSE

Nothing in this Agreement grants any rights to either Party in the Confidential Information of the other Party except as expressly set forth herein.

8. REMEDIES

Each Party acknowledges that unauthorized disclosure or use of Confidential Information may cause irreparable harm and significant injury. Both Parties agree that equitable relief, including injunction and specific performance, are appropriate remedies.

9. GOVERNING LAW

This Agreement shall be governed by and construed in accordance with the laws of the jurisdiction in which the First Party is located, without regard to conflicts of law principles.

10. ENTIRE AGREEMENT

This Agreement constitutes the entire agreement between the Parties concerning the subject matter hereof and supersedes all prior agreements and understandings, whether written or oral.

IN WITNESS WHEREOF, the Parties have executed this Mutual Non-Disclosure Agreement as of the Effective Date.

FIRST PARTY:
${data.party1Name}

Signature: _________________________
Name: _____________________________
Title: ____________________________
Date: _____________________________


SECOND PARTY:
${data.party2Name}

Signature: _________________________
Name: _____________________________
Title: ____________________________
Date: _____________________________
    `.trim(),
  },
  {
    id: 'employment-offer',
    title: 'Employment Offer Letter',
    category: 'Employment',
    description: 'A formal offer letter for full-time employment positions.',
    difficulty: 'beginner',
    estimatedTime: '5 minutes',
    tags: ['employment', 'hiring', 'full-time'],
    fields: [
      {
        id: 'companyName',
        label: 'Company Name',
        type: 'text',
        required: true,
      },
      {
        id: 'companyAddress',
        label: 'Company Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'candidateName',
        label: 'Candidate Name',
        type: 'text',
        required: true,
      },
      {
        id: 'candidateAddress',
        label: 'Candidate Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'jobTitle',
        label: 'Job Title',
        type: 'text',
        placeholder: 'Senior Software Engineer',
        required: true,
      },
      {
        id: 'department',
        label: 'Department',
        type: 'text',
        placeholder: 'Engineering',
        required: true,
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        id: 'salary',
        label: 'Annual Salary',
        type: 'number',
        placeholder: '80000',
        required: true,
      },
      {
        id: 'reportingTo',
        label: 'Reports To',
        type: 'text',
        placeholder: 'Director of Engineering',
        required: true,
      },
    ],
    generateDocument: (data) => `
EMPLOYMENT OFFER LETTER

${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}

${data.candidateName}
${data.candidateAddress}

Dear ${data.candidateName.split(' ')[0]},

We are pleased to offer you the position of ${data.jobTitle} at ${data.companyName}. We believe your skills and experience will be a valuable addition to our team.

POSITION DETAILS

Position: ${data.jobTitle}
Department: ${data.department}
Reports To: ${data.reportingTo}
Start Date: ${data.startDate}
Location: ${data.companyAddress}

COMPENSATION

Annual Salary: $${parseInt(data.salary).toLocaleString()}
Payment Schedule: Bi-weekly

This salary is subject to applicable tax withholdings and deductions.

BENEFITS

As a full-time employee, you will be eligible for our comprehensive benefits package, including:
• Health, dental, and vision insurance
• 401(k) retirement plan with company match
• Paid time off (PTO)
• Paid holidays
• Professional development opportunities
• Additional benefits as outlined in the employee handbook

EMPLOYMENT TERMS

This offer is for full-time employment. Your employment with ${data.companyName} will be "at-will," meaning that either you or the company may terminate the employment relationship at any time, with or without cause or notice.

This position may require you to sign additional agreements, including but not limited to:
• Confidentiality Agreement
• Intellectual Property Assignment Agreement
• Employee Handbook Acknowledgment

CONTINGENCIES

This offer is contingent upon:
• Successful completion of background check
• Verification of your legal right to work in the United States
• Satisfactory reference checks

ACCEPTANCE

To accept this offer, please sign and return this letter by [Date - typically 7 days from offer date]. If you have any questions about this offer, please don't hesitate to contact me.

We are excited about the possibility of you joining our team and look forward to your positive response.

Sincerely,

_________________________
[Hiring Manager Name]
[Title]
${data.companyName}

ACCEPTANCE

I, ${data.candidateName}, accept the above offer of employment with the terms and conditions as stated.

Signature: _________________________
Date: _____________________________
    `.trim(),
  },
  {
    id: 'service-agreement',
    title: 'Service Agreement',
    category: 'Services',
    description: 'A contract for professional services between a service provider and client.',
    difficulty: 'intermediate',
    estimatedTime: '8 minutes',
    tags: ['services', 'contractor', 'consulting'],
    fields: [
      {
        id: 'providerName',
        label: 'Service Provider Name',
        type: 'text',
        required: true,
      },
      {
        id: 'providerAddress',
        label: 'Provider Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'clientName',
        label: 'Client Name',
        type: 'text',
        required: true,
      },
      {
        id: 'clientAddress',
        label: 'Client Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'serviceDescription',
        label: 'Description of Services',
        type: 'textarea',
        placeholder: 'Detailed description of services to be provided...',
        required: true,
      },
      {
        id: 'startDate',
        label: 'Start Date',
        type: 'date',
        required: true,
      },
      {
        id: 'endDate',
        label: 'End Date',
        type: 'date',
        required: true,
      },
      {
        id: 'paymentAmount',
        label: 'Total Payment Amount',
        type: 'number',
        placeholder: '5000',
        required: true,
      },
      {
        id: 'paymentSchedule',
        label: 'Payment Schedule',
        type: 'select',
        options: ['Upon Completion', 'Monthly', 'Bi-weekly', 'Weekly', 'Milestone-based'],
        required: true,
      },
    ],
    generateDocument: (data) => `
SERVICE AGREEMENT

This Service Agreement (the "Agreement") is entered into as of ${data.startDate}, by and between:

SERVICE PROVIDER:
${data.providerName}
${data.providerAddress}
(the "Provider")

AND

CLIENT:
${data.clientName}
${data.clientAddress}
(the "Client")

WHEREAS, the Client desires to retain the Provider to perform certain services, and the Provider agrees to perform such services under the terms and conditions set forth in this Agreement.

NOW, THEREFORE, in consideration of the mutual covenants and agreements herein contained, the parties agree as follows:

1. SERVICES

The Provider agrees to perform the following services (the "Services"):

${data.serviceDescription}

2. TERM

This Agreement shall commence on ${data.startDate} and shall continue until ${data.endDate}, unless earlier terminated as provided herein (the "Term").

3. COMPENSATION

3.1 Payment: The Client agrees to pay the Provider a total of $${parseInt(data.paymentAmount).toLocaleString()} for the Services.

3.2 Payment Schedule: Payment shall be made ${data.paymentSchedule.toLowerCase()}.

3.3 Expenses: Unless otherwise agreed in writing, the Provider shall be responsible for all expenses incurred in connection with the performance of the Services.

4. INDEPENDENT CONTRACTOR

The Provider is an independent contractor and not an employee of the Client. The Provider shall have no authority to bind the Client or act as its agent.

5. INTELLECTUAL PROPERTY

5.1 Work Product: All work product, deliverables, and materials created by the Provider in the course of performing the Services (the "Work Product") shall be the property of the Client.

5.2 Assignment: The Provider hereby assigns to the Client all right, title, and interest in and to the Work Product, including all intellectual property rights therein.

6. CONFIDENTIALITY

The Provider agrees to maintain the confidentiality of all proprietary and confidential information of the Client disclosed during the term of this Agreement.

7. WARRANTIES

The Provider warrants that:
a) The Services will be performed in a professional and workmanlike manner;
b) The Provider has the necessary skills, experience, and qualifications to perform the Services;
c) The Work Product will not infringe upon any third-party intellectual property rights.

8. TERMINATION

8.1 Either party may terminate this Agreement with 30 days' written notice to the other party.

8.2 The Client may terminate this Agreement immediately for cause if the Provider materially breaches any term of this Agreement.

9. LIMITATION OF LIABILITY

In no event shall either party be liable for any indirect, incidental, consequential, or punitive damages arising out of this Agreement.

10. GENERAL PROVISIONS

10.1 Governing Law: This Agreement shall be governed by the laws of the jurisdiction in which the Client is located.

10.2 Entire Agreement: This Agreement constitutes the entire agreement between the parties and supersedes all prior agreements and understandings.

10.3 Amendment: This Agreement may only be amended in writing signed by both parties.

10.4 Assignment: Neither party may assign this Agreement without the prior written consent of the other party.

IN WITNESS WHEREOF, the parties have executed this Service Agreement as of the date first written above.

PROVIDER:
${data.providerName}

Signature: _________________________
Date: _____________________________


CLIENT:
${data.clientName}

Signature: _________________________
Date: _____________________________
    `.trim(),
  },
  {
    id: 'lease-agreement',
    title: 'Residential Lease Agreement',
    category: 'Real Estate',
    description: 'A standard residential lease agreement for renting property.',
    difficulty: 'intermediate',
    estimatedTime: '10 minutes',
    tags: ['real estate', 'rental', 'landlord', 'tenant'],
    fields: [
      {
        id: 'landlordName',
        label: 'Landlord Name',
        type: 'text',
        required: true,
      },
      {
        id: 'landlordAddress',
        label: 'Landlord Address',
        type: 'textarea',
        required: true,
      },
      {
        id: 'tenantName',
        label: 'Tenant Name',
        type: 'text',
        required: true,
      },
      {
        id: 'propertyAddress',
        label: 'Property Address',
        type: 'textarea',
        placeholder: 'Full address of the rental property',
        required: true,
      },
      {
        id: 'leaseStartDate',
        label: 'Lease Start Date',
        type: 'date',
        required: true,
      },
      {
        id: 'leaseDuration',
        label: 'Lease Duration (months)',
        type: 'select',
        options: ['6', '12', '18', '24', '36'],
        required: true,
      },
      {
        id: 'monthlyRent',
        label: 'Monthly Rent',
        type: 'number',
        placeholder: '1500',
        required: true,
      },
      {
        id: 'securityDeposit',
        label: 'Security Deposit',
        type: 'number',
        placeholder: '1500',
        required: true,
      },
      {
        id: 'rentDueDate',
        label: 'Rent Due Date (day of month)',
        type: 'select',
        options: ['1', '5', '10', '15', '20', '25'],
        required: true,
      },
    ],
    generateDocument: (data) => `
RESIDENTIAL LEASE AGREEMENT

This Residential Lease Agreement (the "Lease") is entered into as of ${data.leaseStartDate}, by and between:

LANDLORD:
${data.landlordName}
${data.landlordAddress}

AND

TENANT:
${data.tenantName}

PREMISES

The Landlord agrees to lease to the Tenant the residential property located at:
${data.propertyAddress}
(the "Premises")

TERM

The lease term shall begin on ${data.leaseStartDate} and continue for ${data.leaseDuration} months (the "Term").

RENT

1. Monthly Rent: The Tenant agrees to pay monthly rent of $${parseInt(data.monthlyRent).toLocaleString()}.

2. Due Date: Rent is due on the ${data.rentDueDate}th day of each month.

3. Payment Method: Rent shall be paid to the Landlord at the address specified above or as otherwise directed in writing.

4. Late Fee: A late fee of $50 will be charged if rent is not received within 5 days of the due date.

SECURITY DEPOSIT

1. Amount: The Tenant shall pay a security deposit of $${parseInt(data.securityDeposit).toLocaleString()} upon execution of this Lease.

2. Purpose: The security deposit will be held to cover any damages to the Premises beyond normal wear and tear.

3. Return: The security deposit will be returned within 30 days after the end of the lease term, less any lawful deductions.

USE OF PREMISES

1. The Premises shall be used for residential purposes only.

2. The Tenant shall not sublet the Premises or assign this Lease without the Landlord's written consent.

3. The Tenant shall comply with all applicable laws, ordinances, and regulations.

MAINTENANCE AND REPAIRS

1. Landlord's Responsibilities:
   • Maintain the structural integrity of the Premises
   • Ensure major systems (plumbing, heating, electrical) are in working order
   • Make necessary repairs to maintain habitability

2. Tenant's Responsibilities:
   • Keep the Premises clean and sanitary
   • Report needed repairs promptly
   • Pay for damages caused by negligence or misuse
   • Maintain smoke detectors and replace batteries

UTILITIES

The Tenant shall be responsible for payment of the following utilities:
• Electricity
• Gas
• Water/Sewer
• Internet/Cable
• Trash removal

INSURANCE

The Tenant is encouraged to obtain renter's insurance to cover personal property and liability.

PETS

No pets are allowed on the Premises without the prior written consent of the Landlord.

TERMINATION

1. This Lease may be terminated by either party with 30 days' written notice prior to the end of the Term.

2. The Landlord may terminate this Lease immediately for:
   • Non-payment of rent
   • Material breach of this Lease
   • Illegal activities on the Premises

ENTRY AND INSPECTION

The Landlord may enter the Premises for inspection, repairs, or showing to prospective tenants/buyers with 24 hours' notice, except in emergencies.

GENERAL PROVISIONS

1. Governing Law: This Lease shall be governed by the laws of the state in which the Premises is located.

2. Entire Agreement: This Lease constitutes the entire agreement between the parties.

3. Amendments: This Lease may only be amended in writing signed by both parties.

IN WITNESS WHEREOF, the parties have executed this Residential Lease Agreement.

LANDLORD:
${data.landlordName}

Signature: _________________________
Date: _____________________________


TENANT:
${data.tenantName}

Signature: _________________________
Date: _____________________________
    `.trim(),
  },
  {
    id: 'freelance-contract',
    title: 'Freelance Contract',
    category: 'Business Contracts',
    description: 'A contract for freelance or independent contractor work.',
    difficulty: 'beginner',
    estimatedTime: '6 minutes',
    tags: ['freelance', 'contractor', 'gig work'],
    fields: [
      {
        id: 'freelancerName',
        label: 'Freelancer Name',
        type: 'text',
        required: true,
      },
      {
        id: 'clientName',
        label: 'Client Name',
        type: 'text',
        required: true,
      },
      {
        id: 'projectDescription',
        label: 'Project Description',
        type: 'textarea',
        placeholder: 'Describe the project deliverables...',
        required: true,
      },
      {
        id: 'projectDeadline',
        label: 'Project Deadline',
        type: 'date',
        required: true,
      },
      {
        id: 'totalFee',
        label: 'Total Project Fee',
        type: 'number',
        placeholder: '3000',
        required: true,
      },
      {
        id: 'paymentTerms',
        label: 'Payment Terms',
        type: 'select',
        options: ['50% upfront, 50% on completion', 'Full payment on completion', 'Monthly installments', 'Upon milestones'],
        required: true,
      },
    ],
    generateDocument: (data) => `
FREELANCE CONTRACT

This Freelance Contract (the "Agreement") is made as of ${new Date().toLocaleDateString()} between:

FREELANCER:
${data.freelancerName}
(the "Freelancer")

AND

CLIENT:
${data.clientName}
(the "Client")

1. PROJECT DESCRIPTION

The Freelancer agrees to complete the following project (the "Project"):

${data.projectDescription}

2. DELIVERABLES AND DEADLINE

The Freelancer shall complete and deliver the Project by ${data.projectDeadline}.

3. COMPENSATION

3.1 The Client agrees to pay the Freelancer a total of $${parseInt(data.totalFee).toLocaleString()} for the Project.

3.2 Payment Terms: ${data.paymentTerms}

3.3 All payments shall be made via [specify payment method].

4. OWNERSHIP AND INTELLECTUAL PROPERTY

Upon full payment, all work product and intellectual property created for this Project shall be owned exclusively by the Client.

5. INDEPENDENT CONTRACTOR STATUS

The Freelancer is an independent contractor. This Agreement does not create an employer-employee relationship.

6. REVISIONS

The Freelancer agrees to provide up to [2] rounds of reasonable revisions at no additional cost.

7. CONFIDENTIALITY

The Freelancer agrees to keep all Client information confidential and not disclose it to third parties.

8. TERMINATION

Either party may terminate this Agreement with written notice. The Client shall pay for work completed up to the termination date.

9. WARRANTIES

The Freelancer warrants that:
• The work will be original and not infringe on third-party rights
• The work will be completed in a professional manner
• The Freelancer has the skills necessary to complete the Project

IN WITNESS WHEREOF, the parties have executed this Agreement.

FREELANCER:
${data.freelancerName}

Signature: _________________________
Date: _____________________________


CLIENT:
${data.clientName}

Signature: _________________________
Date: _____________________________
    `.trim(),
  },
];
