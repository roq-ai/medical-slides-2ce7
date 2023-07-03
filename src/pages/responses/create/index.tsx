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
import { createResponse } from 'apiSdk/responses';
import { Error } from 'components/error';
import { responseValidationSchema } from 'validationSchema/responses';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PollInterface } from 'interfaces/poll';
import { UserInterface } from 'interfaces/user';
import { getPolls } from 'apiSdk/polls';
import { getUsers } from 'apiSdk/users';
import { ResponseInterface } from 'interfaces/response';

function ResponseCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);

  const handleSubmit = async (values: ResponseInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await createResponse(values);
      resetForm();
      router.push('/responses');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<ResponseInterface>({
    initialValues: {
      answer: '',
      poll_id: (router.query.poll_id as string) ?? null,
      user_id: (router.query.user_id as string) ?? null,
    },
    validationSchema: responseValidationSchema,
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
            Create Response
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <form onSubmit={formik.handleSubmit}>
          <FormControl id="answer" mb="4" isInvalid={!!formik.errors?.answer}>
            <FormLabel>Answer</FormLabel>
            <Input type="text" name="answer" value={formik.values?.answer} onChange={formik.handleChange} />
            {formik.errors.answer && <FormErrorMessage>{formik.errors?.answer}</FormErrorMessage>}
          </FormControl>
          <AsyncSelect<PollInterface>
            formik={formik}
            name={'poll_id'}
            label={'Select Poll'}
            placeholder={'Select Poll'}
            fetcher={getPolls}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.question}
              </option>
            )}
          />
          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={getUsers}
            renderOption={(record) => (
              <option key={record.id} value={record.id}>
                {record?.email}
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
    entity: 'response',
    operation: AccessOperationEnum.CREATE,
  }),
)(ResponseCreatePage);
