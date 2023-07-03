import * as yup from 'yup';

export const pollValidationSchema = yup.object().shape({
  question: yup.string().required(),
  slide_id: yup.string().nullable(),
});
