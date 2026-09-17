import { describe, expect, it } from 'vitest';

import type { ContactPayload } from '@/lib/contact/validation';
import { emptyContactPayload, isContactPayloadValid, validateContact } from '@/lib/contact/validation';

const validPayload = (overrides: Partial<ContactPayload> = {}): ContactPayload => ({
  ...emptyContactPayload(),
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'I would like a showcase website for my analytical engine.',
  ...overrides,
});

describe('validateContact', () => {
  it('accepts a minimal valid payload', () => {
    expect(validateContact(validPayload())).toEqual({});
    expect(isContactPayloadValid(validPayload())).toBe(true);
  });

  it('rejects an empty payload on the three required fields', () => {
    expect(validateContact(emptyContactPayload())).toEqual({
      name: 'name_length',
      email: 'email_invalid',
      message: 'message_length',
    });
  });

  it.each([
    ['a', 'name_length'],
    ['a'.repeat(101), 'name_length'],
  ])('rejects the name %#', (name, code) => {
    expect(validateContact(validPayload({ name })).name).toBe(code);
  });

  it.each(['ada', 'ada@example', 'ada @example.com', `${'a'.repeat(250)}@example.com`])(
    'rejects the email %s',
    (email) => {
      expect(validateContact(validPayload({ email })).email).toBe('email_invalid');
    }
  );

  it('only checks the subject when it is filled', () => {
    expect(validateContact(validPayload({ subject: '' })).subject).toBeUndefined();
    expect(validateContact(validPayload({ subject: 'Hi' })).subject).toBe('subject_length');
    expect(validateContact(validPayload({ subject: 'a'.repeat(201) })).subject).toBe('subject_length');
    expect(validateContact(validPayload({ subject: 'A showcase website' })).subject).toBeUndefined();
  });

  it('checks the message length boundaries', () => {
    expect(validateContact(validPayload({ message: 'Too short' })).message).toBe('message_length');
    expect(validateContact(validPayload({ message: 'a'.repeat(5001) })).message).toBe('message_length');
  });

  it('only checks the phone when it is filled', () => {
    expect(validateContact(validPayload({ phone: '' })).phone).toBeUndefined();
    expect(validateContact(validPayload({ phone: 'call me' })).phone).toBe('phone_invalid');
    expect(validateContact(validPayload({ phone: '+33 6 12 34 56 78' })).phone).toBeUndefined();
  });

  it('caps the company name', () => {
    expect(validateContact(validPayload({ company: 'Go Cosmic' })).company).toBeUndefined();
    expect(validateContact(validPayload({ company: 'a'.repeat(121) })).company).toBe('company_length');
  });

  it('trims values before validating', () => {
    expect(validateContact(validPayload({ name: '  Ada  ' })).name).toBeUndefined();
    expect(validateContact(validPayload({ message: `  ${'a'.repeat(9)}  ` })).message).toBe('message_length');
  });

  it('ignores the honeypot field', () => {
    expect(isContactPayloadValid(validPayload({ honeypot: 'bot' }))).toBe(true);
  });
});
