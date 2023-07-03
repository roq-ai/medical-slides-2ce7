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
  Center,
} from '@chakra-ui/react';
import * as yup from 'yup';
import DatePicker from 'react-datepicker';
import { FiEdit3 } from 'react-icons/fi';
import { useFormik, FormikHelpers } from 'formik';
import { getResponseById, updateResponseById } from 'apiSdk/responses';
import { Error } from 'components/error';
import { responseValidationSchema } from 'validationSchema/responses';
import { ResponseInterface } from 'interfaces/response';
import useSWR from 'swr';
import { useRouter } from 'next/router';
import { AsyncSelect } from 'components/async-select';
import { ArrayFormField } from 'components/array-form-field';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { PollInterface } from 'interfaces/poll';
import { UserInterface } from 'interfaces/user';
import { getPolls } from 'apiSdk/polls';
import { getUsers } from 'apiSdk/users';

function ResponseEditPage() {
  const router = useRouter();
  const id = router.query.id as string;
  const { data, error, isLoading, mutate } = useSWR<ResponseInterface>(
    () => (id ? `/responses/${id}` : null),
    () => getResponseById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: ResponseInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updateResponseById(id, values);
      mutate(updated);
      resetForm();
      router.push('/responses');
    } catch (error) {
      setFormError(error);
    }
  };

  const formik = useFormik<ResponseInterface>({
    initialValues: data,
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
            Edit Response
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        {formError && (
          <Box mb={4}>
            <Error error={formError} />
          </Box>
        )}
        {isLoading || (!formik.values && !error) ? (
          <Center>
            <Spinner />
          </Center>
        ) : (
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
        )}
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
    operation: AccessOperationEnum.UPDATE,
  }),
)(ResponseEditPage);
