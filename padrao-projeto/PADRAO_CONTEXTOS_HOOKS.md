# 🔗 Padrão de Contextos e Hooks Customizados

## Gerenciamento de Estado Global e Hooks Reutilizáveis

Esta documentação apresenta os padrões utilizados para criar contextos React, hooks customizados e sua integração na aplicação.

---

## 📋 **Stack Tecnológica**

```typescript
// Principais bibliotecas utilizadas
import { createContext, useContext, useState, useRef, useCallback } from "react";
import { useLocalStorage } from "usehooks-ts";
```

---

## 🔐 **Padrão de Contexto de Autenticação**

### **1. Definição da Interface**

```typescript
// contexts/auth/auth-context.ts
import { createContext } from "react";

interface IAuthProvider {
  // Estados
  isAuthenticated: boolean;
  
  // Ações
  onSignIn: (token: string) => void;
  onSignOut: () => void;
  
  // Propriedades opcionais (comentadas para futuro uso)
  // notificationToken?: string;
  // requestPermission?: () => Promise<void>;
}

const AuthContext = createContext({} as IAuthProvider);

export { AuthContext, type IAuthProvider };
```

### **2. Implementação do Provider**

```typescript
// contexts/auth/auth-provider.tsx
import { type ReactNode, useState } from "react";
import { useLocalStorage } from "usehooks-ts";
import { AuthContext } from "./auth-context";
import { STORAGE_KEYS } from "@/constants/storage-keys";

interface IAuthProviderProps {
  children: ReactNode;
}

function AuthProvider({ children }: IAuthProviderProps) {
  // 1. Hooks de persistência
  const [token, setToken, removeToken] = useLocalStorage<string>(
    STORAGE_KEYS.AUTH_TOKEN, 
    ""
  );
  
  // 2. Estados locais derivados
  const [isAuthenticated, setIsAuthenticated] = useState(token !== "");

  // 3. Ações do contexto
  const onSignIn = (authToken: string) => {
    if (authToken !== "") {
      setToken(authToken);
      setIsAuthenticated(true);
    }
  };

  const onSignOut = () => {
    setIsAuthenticated(false);
    removeToken();
  };

  // 4. Provider com valor do contexto
  return (
    <AuthContext.Provider 
      value={{ 
        isAuthenticated, 
        onSignIn, 
        onSignOut 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider };
```

### **3. Hook de Acesso ao Contexto**

```typescript
// contexts/auth/use-auth.ts
import { useContext } from "react";
import { AuthContext } from "./auth-context";

const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  
  return context;
};

export { useAuth };
```

### **4. Configuração na Aplicação**

```typescript
// App.tsx
import { AuthProvider } from "./contexts/auth/auth-provider";
import { ThemeProvider } from "./components/theme/theme-provider";
import { Routes } from "./routes";

export function App() {
  return (
    <ThemeProvider defaultTheme="dark">
      <AuthProvider>
        <Routes />
      </AuthProvider>
    </ThemeProvider>
  );
}
```

---

## 🎯 **Template Padrão para Contextos**

### **Estrutura Completa de um Contexto**

```typescript
// contexts/feature/feature-context.ts
import { createContext } from "react";

// 1. Interface do contexto
interface IFeatureContext {
  // Estados
  data: DataType | null;
  isLoading: boolean;
  error: string | null;
  
  // Ações
  fetchData: () => void;
  updateData: (data: Partial<DataType>) => void;
  clearError: () => void;
}

// 2. Criação do contexto
const FeatureContext = createContext({} as IFeatureContext);

export { FeatureContext, type IFeatureContext };
```

```typescript
// contexts/feature/feature-provider.tsx
import { type ReactNode, useState, useCallback } from "react";
import { FeatureContext } from "./feature-context";

interface IFeatureProviderProps {
  children: ReactNode;
}

function FeatureProvider({ children }: IFeatureProviderProps) {
  // 1. Estados do contexto
  const [data, setData] = useState<DataType | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 2. Ações do contexto
  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await api.getData();
      setData(response);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateData = useCallback((newData: Partial<DataType>) => {
    setData(prev => prev ? { ...prev, ...newData } : null);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 3. Valor do contexto
  const contextValue = {
    data,
    isLoading,
    error,
    fetchData,
    updateData,
    clearError,
  };

  return (
    <FeatureContext.Provider value={contextValue}>
      {children}
    </FeatureContext.Provider>
  );
}

export { FeatureProvider };
```

```typescript
// contexts/feature/use-feature.ts
import { useContext } from "react";
import { FeatureContext } from "./feature-context";

const useFeature = () => {
  const context = useContext(FeatureContext);
  
  if (!context) {
    throw new Error("useFeature must be used within a FeatureProvider");
  }
  
  return context;
};

export { useFeature };
```

---

## 🪝 **Padrões de Hooks Customizados**

### **1. Hook de Máscara de Telefone**

```typescript
// hooks/use-phone-mask.ts
import { type FormEvent, useCallback, useRef } from "react";

function formatPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  
  if (digits.length <= 10) {
    // (99) 9999-9999
    return digits.replace(
      /^(\d{0,2})(\d{0,4})(\d{0,4}).*/,
      (_, d1, d2, d3) =>
        [d1 && `(${d1}`, d2 && `) ${d2}`, d3 && `-${d3}`]
          .filter(Boolean)
          .join("")
    );
  }
  
  // (99) 99999-9999
  return digits.replace(
    /^(\d{0,2})(\d{0,5})(\d{0,4}).*/,
    (_, d1, d2, d3) =>
      [d1 && `(${d1}`, d2 && `) ${d2}`, d3 && `-${d3}`]
        .filter(Boolean)
        .join("")
  );
}

export function usePhoneMask() {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInput = useCallback((e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    const formatted = formatPhone(target.value.replace(/^\+55\s?/, ""));
    
    if (formatted.length > 0) {
      target.value = `+55 ${formatted}`;
    } else {
      target.value = "";
    }
  }, []);

  return { 
    phoneRef: inputRef, 
    onInput 
  };
}
```

### **2. Hook de Máscara de Documento**

```typescript
// hooks/use-document-mask.ts
import { type FormEvent, useCallback, useRef } from "react";

function formatDocument(value: string) {
  const digits = value.replace(/\D/g, "");
  
  if (digits.length <= 11) {
    // CPF: 999.999.999-99
    return digits.replace(
      /^(\d{0,3})(\d{0,3})(\d{0,3})(\d{0,2}).*/,
      (_, d1, d2, d3, d4) =>
        [d1, d2 && `.${d2}`, d3 && `.${d3}`, d4 && `-${d4}`]
          .filter(Boolean)
          .join("")
    );
  }
  
  // CNPJ: 99.999.999/9999-99
  return digits.replace(
    /^(\d{0,2})(\d{0,3})(\d{0,3})(\d{0,4})(\d{0,2}).*/,
    (_, d1, d2, d3, d4, d5) =>
      [d1, d2 && `.${d2}`, d3 && `.${d3}`, d4 && `/${d4}`, d5 && `-${d5}`]
        .filter(Boolean)
        .join("")
  );
}

export function useDocumentMask() {
  const inputRef = useRef<HTMLInputElement>(null);

  const onInput = useCallback((e: FormEvent<HTMLInputElement>) => {
    const target = e.currentTarget;
    target.value = formatDocument(target.value);
  }, []);

  return { 
    documentRef: inputRef, 
    documentInput: onInput 
  };
}
```

---

## 🔧 **Templates de Hooks por Categoria**

### **1. Hook de Estado Local com Persistência**

```typescript
// hooks/use-local-state.ts
import { useState, useEffect } from "react";

export function useLocalState<T>(
  key: string, 
  initialValue: T
): [T, (value: T) => void] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, state]);

  return [state, setState];
}
```

### **2. Hook de Toggle/Boolean**

```typescript
// hooks/use-toggle.ts
import { useState, useCallback } from "react";

export function useToggle(
  initialValue: boolean = false
): [boolean, () => void, (value: boolean) => void] {
  const [value, setValue] = useState(initialValue);

  const toggle = useCallback(() => {
    setValue(prev => !prev);
  }, []);

  const setToggle = useCallback((newValue: boolean) => {
    setValue(newValue);
  }, []);

  return [value, toggle, setToggle];
}
```

### **3. Hook de Debounce**

```typescript
// hooks/use-debounce.ts
import { useState, useEffect } from "react";

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

### **4. Hook de API com Cache**

```typescript
// hooks/use-api.ts
import { useState, useEffect, useCallback } from "react";

interface UseApiOptions<T> {
  initialData?: T;
  enabled?: boolean;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
}

export function useApi<T>(
  apiFunction: () => Promise<T>,
  dependencies: any[] = [],
  options: UseApiOptions<T> = {}
) {
  const [data, setData] = useState<T | null>(options.initialData || null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchData = useCallback(async () => {
    if (options.enabled === false) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await apiFunction();
      setData(result);
      options.onSuccess?.(result);
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      options.onError?.(error);
    } finally {
      setIsLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch };
}
```

### **5. Hook de Formulário com Validação**

```typescript
// hooks/use-form-validation.ts
import { useState, useCallback } from "react";

type ValidationRule<T> = (value: T) => string | null;

interface UseFormValidationOptions<T> {
  initialValues: T;
  validationRules?: Partial<Record<keyof T, ValidationRule<any>>>;
  onSubmit?: (values: T) => void | Promise<void>;
}

export function useFormValidation<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormValidationOptions<T>) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const setValue = useCallback((name: keyof T, value: any) => {
    setValues(prev => ({ ...prev, [name]: value }));
    
    // Validar campo se já foi tocado
    if (touched[name] && validationRules[name]) {
      const error = validationRules[name]!(value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validationRules, touched]);

  const setFieldTouched = useCallback((name: keyof T) => {
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Validar campo quando tocado
    if (validationRules[name]) {
      const error = validationRules[name]!(values[name]);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  }, [validationRules, values]);

  const validateForm = useCallback(() => {
    const newErrors: Partial<Record<keyof T, string>> = {};
    let isValid = true;

    Object.keys(validationRules).forEach(key => {
      const fieldName = key as keyof T;
      const error = validationRules[fieldName]!(values[fieldName]);
      if (error) {
        newErrors[fieldName] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  }, [validationRules, values]);

  const handleSubmit = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!validateForm() || !onSubmit) return;

    setIsSubmitting(true);
    try {
      await onSubmit(values);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  }, [validateForm, onSubmit, values]);

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    setValue,
    setFieldTouched,
    handleSubmit,
    reset,
    validateForm,
  };
}
```

---

## 📁 **Organização de Arquivos**

### **Estrutura de Contextos**

```
src/contexts/
├── auth/
│   ├── auth-context.ts      # Interface e criação do contexto
│   ├── auth-provider.tsx    # Implementação do provider
│   └── use-auth.ts          # Hook de acesso
├── theme/
│   ├── theme-context.ts
│   ├── theme-provider.tsx
│   └── use-theme.ts
└── feature/
    ├── feature-context.ts
    ├── feature-provider.tsx
    └── use-feature.ts
```

### **Estrutura de Hooks**

```
src/hooks/
├── use-api.ts              # Hook genérico para APIs
├── use-debounce.ts         # Hook de debounce
├── use-toggle.ts           # Hook de toggle/boolean
├── use-local-state.ts      # Hook com localStorage
├── use-form-validation.ts  # Hook de validação de formulário
├── masks/                  # Hooks de máscaras
│   ├── use-phone-mask.ts
│   ├── use-document-mask.ts
│   └── use-currency-mask.ts
└── ui/                     # Hooks relacionados à UI
    ├── use-file-upload.ts
    ├── use-modal.ts
    └── use-pagination.ts
```

---

## 🎯 **Uso dos Contextos e Hooks**

### **1. Usando o Contexto de Auth**

```typescript
// pages/app/dashboard.tsx
import { useAuth } from "@/contexts/auth/use-auth";

export function Dashboard() {
  const { isAuthenticated, onSignOut } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/entrar" />;
  }

  return (
    <div>
      <button onClick={onSignOut}>
        Sair
      </button>
    </div>
  );
}
```

### **2. Usando Hooks de Máscara**

```typescript
// components/forms/phone-input.tsx
import { usePhoneMask } from "@/hooks/use-phone-mask";

export function PhoneInput() {
  const { phoneRef, onInput } = usePhoneMask();

  return (
    <input
      ref={phoneRef}
      onInput={onInput}
      placeholder="+55 (00) 00000-0000"
    />
  );
}
```

### **3. Integração com React Hook Form**

```typescript
// components/forms/profile-form.tsx
import { useForm } from "react-hook-form";
import { usePhoneMask } from "@/hooks/use-phone-mask";

export function ProfileForm() {
  const { register, handleSubmit } = useForm();
  const phoneMask = usePhoneMask();

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        {...register("phone")}
        {...phoneMask}
        placeholder="Telefone"
      />
    </form>
  );
}
```

---

## 💾 **Constantes de Armazenamento**

```typescript
// constants/storage-keys.ts
export const STORAGE_KEYS = {
  // Autenticação
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  TOKEN_NOTIFICATION: "token_notification",
  
  // Preferências do usuário
  THEME: "theme",
  LANGUAGE: "language",
  
  // Dados temporários
  FORM_DRAFT: "form_draft",
  LAST_ROUTE: "last_route",
} as const;
```

---

## ✅ **Checklist de Implementação**

### **Para Contextos**
- [ ] Interface bem definida com tipos TypeScript
- [ ] Provider com estado e ações necessárias
- [ ] Hook de acesso com validação de provider
- [ ] Tratamento de erros adequado
- [ ] Persistência quando necessária (localStorage)

### **Para Hooks Customizados**
- [ ] Nome descritivo iniciando com "use"
- [ ] Tipos TypeScript para parâmetros e retorno
- [ ] Memoização adequada (useCallback, useMemo)
- [ ] Cleanup quando necessário (useEffect return)
- [ ] Documentação de uso e exemplos

### **Para Organização**
- [ ] Arquivos organizados por funcionalidade
- [ ] Exports consistentes
- [ ] Nomes de arquivos padronizados
- [ ] Barrel exports quando aplicável
- [ ] Documentação atualizada

---

## 🎯 **Exemplo Completo - Context de Notificações**

```typescript
// contexts/notifications/notification-context.ts
import { createContext } from "react";

export type NotificationType = "success" | "error" | "warning" | "info";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
  duration?: number;
}

interface INotificationContext {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => string;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext({} as INotificationContext);

export { NotificationContext, type INotificationContext };
```

```typescript
// contexts/notifications/notification-provider.tsx
import { type ReactNode, useState, useCallback } from "react";
import { NotificationContext, type Notification } from "./notification-context";

interface INotificationProviderProps {
  children: ReactNode;
}

function NotificationProvider({ children }: INotificationProviderProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = useCallback((
    notification: Omit<Notification, "id">
  ): string => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification: Notification = {
      ...notification,
      id,
      duration: notification.duration || 5000,
    };

    setNotifications(prev => [...prev, newNotification]);

    // Auto remove após duration
    if (newNotification.duration > 0) {
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);
    }

    return id;
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        removeNotification,
        clearAll,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export { NotificationProvider };
```

```typescript
// contexts/notifications/use-notifications.ts
import { useContext } from "react";
import { NotificationContext } from "./notification-context";

const useNotifications = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  
  return context;
};

export { useNotifications };
```

```typescript
// hooks/use-toast.ts
import { useNotifications } from "@/contexts/notifications/use-notifications";

export function useToast() {
  const { addNotification } = useNotifications();

  const toast = {
    success: (title: string, message?: string) =>
      addNotification({ type: "success", title, message }),
    
    error: (title: string, message?: string) =>
      addNotification({ type: "error", title, message }),
    
    warning: (title: string, message?: string) =>
      addNotification({ type: "warning", title, message }),
    
    info: (title: string, message?: string) =>
      addNotification({ type: "info", title, message }),
  };

  return toast;
}
```

---

*Esta documentação estabelece padrões consistentes para contextos e hooks, garantindo código reutilizável, manutenível e bem estruturado.*
