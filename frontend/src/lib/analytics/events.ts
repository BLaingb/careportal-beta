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
  }
} as const;

export default events;
