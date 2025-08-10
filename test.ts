// селекторами
const updateField = <K extends keyof TMap>(key: K, value: ExtractValue<TMap[K]>) => {
  formStore.batch(() => {
    const validator = formStore.get(($, t) => $.fields[t(key)].validate)!;
    const initialVal = formStore.get(($, t) => $.fields[t(key)].initialValue)!;
    const dataValidate = formStore.get(($, t) => $.fields[t(key)].dataValidate);
    const isError = value == null ? false : !runValidation(validator, value, dataValidate);

    formStore.update(($, t) => $.fields[t(key)].value, value);
    formStore.update(($, t) => $.fields[t(key)].isError, isError);
    formStore.update(($, t) => $.fields[t(key)].isDirty, value !== initialVal);
  });

  const allFields = formStore.get(($) => $.fields)!;
  const isFormValid = Object.keys(allFields).every((key) => {
    const field = allFields[key as K];
    if (field.value == null) return false;
    return !field.isError;
  });
  formStore.update(($) => $.isValid, isFormValid);
};
// без селекторов
const updateField = <K extends keyof TMap>(key: K, value: ExtractValue<TMap[K]>) => {
  formStore.batch(() => {
    const validator = formStore.get(`fields.${key}.validate`)!;
    const initialVal = formStore.get(`fields.${key}.initialValue`)!;
    const dataValidate = formStore.get(`fields.${key}.dataValidate`);
    const isError = value == null ? false : !runValidation(validator, value, dataValidate);

    formStore.update(`fields.${key}.value`, value);
    formStore.update(`fields.${key}.isError`, isError);
    formStore.update(`fields.${key}.isDirty`, value !== initialVal);
  });

  const allFields = formStore.get(`fields`)!;
  const isFormValid = Object.keys(allFields).every((fieldKey) => {
    const field = allFields[fieldKey as K];
    if (field.value == null) return false;
    return !field.isError;
  });
  formStore.update(`isValid`, isFormValid);
};
