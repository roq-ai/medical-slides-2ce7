import * as yup from 'yup';

export const slideValidationSchema = yup.object().shape({
  content: yup.string().required(),
  presentation_id: yup.string().nullable(),
});
