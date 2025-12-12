import { useState } from 'react';

type FormOptions = Record<string, unknown>;

export const useForm = <T extends FormOptions>(attributes: T) => {
  const [options, setOptions] = useState<T>(attributes);

  const getOption = <K extends keyof T>(key: K): T[K] => options[key];

  const setOption = <K extends keyof T>(key: K, value: T[K]) => {
    setOptions((prev) => ({ ...prev, [key]: value }));
  };

  return { options, getOption, setOption };
};
