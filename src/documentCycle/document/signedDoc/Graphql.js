export function Maybe(T) {
    return T || null;
  }
  export function InputMaybe(T) {
    return Maybe(T);
  }
  export function Exact(T) {
    return T;
  }
  export function MakeOptional(T, K) {
    return {
      ...T,
      [K]: undefined
    };
  }
  export function MakeMaybe(T, K) {
    return {
      ...T,
      [K]: Maybe(T[K])
    };
  }
  export function MakeEmpty(T, K) {
    return {
      [K]: undefined
    };
  }
  export function Incremental(T) {
    return T || {};
  }
  export const Scalars = {
    ID: { input: 'string', output: 'string' },
    String: { input: 'string', output: 'string' },
    Boolean: { input: 'boolean', output: 'boolean' },
    Int: { input: 'number', output: 'number' },
    Float: { input: 'number', output: 'number' },
    DateTimeISO: { input: 'string', output: 'string' }
  };
  export const ActivityReason = {
    DocumentCreated: 'document_created',
    DocumentDownloaded: 'document_downloaded',
    DocumentSent: 'document_sent',
    DocumentSigned: 'document_signed',
    DocumentUpdated: 'document_updated',
    SignerVerified: 'signer_verified'
  };
  export const DocumentFieldType = {
    Date: 'date',
    Email: 'email',
    Initials: 'initials',
    Name: 'name',
    Signature: 'signature',
    Text: 'text'
  };
  export const DocumentStatus = {
    Draft: 'draft',
    Processing: 'processing',
    Sent: 'sent',
    Signed: 'signed'
  };
  export const InviteStatus = {
    Accepted: 'accepted',
    Pending: 'pending',
    Rejected: 'rejected'
  };
  export const MemberRole = {
    Member: 'member',
    Owner: 'owner'
  };
  export const SignerFieldType = {
    Date: 'date',
    Image: 'image',
    Text: 'text'
  };
  export const SignerStatus = {
    Pending: 'pending',
    Sent: 'sent',
    Signed: 'signed',
    Verifying: 'verifying'
  };
  export const SignerVerificationType = {
    Email: 'email',
    Identity: 'identity',
    None: 'none',
    Phone: 'phone'
  };