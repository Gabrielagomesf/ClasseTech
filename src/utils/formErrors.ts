import type {FieldValues, Path, UseFormSetError} from 'react-hook-form';

export function applyApiErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  errors: Record<string, string>,
) {
  Object.entries(errors).forEach(([path, message]) => {
    setError(path as Path<T>, {type: 'server', message});
  });
}
