import AppLayout from 'layout/app-layout';
import React, { useState } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  NumberInputStepper,
  NumberDecrementStepper,
  NumberInputField,
  NumberIncrementStepper,
  NumberInput,
} from '@chakra-ui/react';
import { useFormik, FormikHelpers } from 'formik';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { createPoll } from 'apiSdk/polls';
import { Error } from 'components/error';
import { pollValidationSchema } from 'validationSchema/polls';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { SlideInterface } from 'interfaces/slide';
import { getSlides } from 'apiSdk/slides';
import { PollInterface } from 'interfaces/poll';

function PollCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: PollInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createPoll(values);
      resetForm();
      router.push('/polls');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<PollInterface>({
    initialValues: {
      question: '',
      slide_id: (router.query.slide_id as string) ?? null,
    },
    validationSchema: pollValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout>
      <Box bg="white" p={4} rounded="md" shadow="md">
        <Box mb={4}>
          <Text as="h1" fontSize="2xl" fontWeight="bold">
            Create Poll
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="question" mb="4" isInvalid={!!formik.errors?.question}>
            <FormLabel>Question</FormLabel>
            <Input type="text" name="question" value={formik.values?.question} onChange={formik.handleChange} />
            {formik.errors.question && <FormErrorMessage>{formik.errors?.question}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<SlideInterface>
            formik={formik}
            name={'slide_id'}
            label={'Select Slide'}
            placeholder={'Select Slide'}
            fetcher={getSlides}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.content}
              </option>
            )}
          />
          <Button isDisabled={formik?.isSubmitting} colorScheme="blue" type="submit" mr="4">
            Submit
          </Button>
        </form>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'poll',
    operation: AccessOperationEnum.CREATE,
  }),
)(PollCreatePage);
