import * as yup from 'yup';

export const responseValidationSchema = yup.object().shape({
  answer: yup.string().required(),
  poll_id: yup.string().nullable(),
  user_id: yup.string().nullable(),
});
