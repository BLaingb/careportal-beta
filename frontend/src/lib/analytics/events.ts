const events = {
  care_match_form_step_completed: {
    name: 'care_match_form_step_completed',
    properties: ({ step, stepName, value }: { step: number, stepName: string, value: string }) => ({
      step,
      stepName,
      value
    })
  },
  care_match_form_submitted: {
    name: 'care_match_form_submitted',
    properties: ({ careType, zipCode }: { careType: string, zipCode: string }) => ({
      careType,
      zipCode
    })
  },
  contact_form_opened: {
    name: 'contact_form_opened',
    properties: ({ context, facilityName, careType, zipCode }: { context: string, facilityName?: string, careType?: string, zipCode?: string }) => ({
      context,
      facilityName,
      careType,
      zipCode
    })
  },
  contact_form_submitted: {
    name: 'contact_form_submitted',
    properties: ({ context, facilityName, careType, zipCode }: { context: string, facilityName?: string, careType?: string, zipCode?: string }) => ({
      context,
      facilityName,
      careType,
      zipCode
    })
  }
} as const;

export default events;
