export const validationRules = {
  email: {
    required: 'Please enter your email address.',
    pattern: {
      value:
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      message: 'Please enter a valid email address.'
    }
  },
  password: {
    required: 'Please enter your password.'
  },
  newPassword: {
    required: 'Please enter your password.',
    minLength: {
      value: 8,
      message: 'Minimum 8 characters.'
    },
    validate: {
      hasNumber: (value: string) => /[0-9]/.test(value) || 'At least 1 number.',
      hasUppercase: (value: string) => /[A-Z]/.test(value) || 'At least 1 uppercase letter.'
    }
  },
  otp: {
    required: 'Please enter verification code.',
    pattern: {
      value: /^[0-9]{6}$/,
      message: 'Please enter a 6-digit verification code.'
    }
  }
} as const
