const events = {
  care_match_form_step_changed: {
    name: 'care_match_form_step_changed',
    properties: (step: number, method: 'next' | 'prev') => ({
      step,
      method
    })
  }
} as const;

export default events;
