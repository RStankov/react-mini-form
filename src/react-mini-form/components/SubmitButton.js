import withForm from '../withForm';

function SubmitButton({ theme, isSubmitting, ...props }) {
  return theme.renderSubmit({ isSubmitting, props });
}

export default withForm((form) => {
  return { isSubmitting: form.getStatus() === 'submitting' };
})(SubmitButton);
