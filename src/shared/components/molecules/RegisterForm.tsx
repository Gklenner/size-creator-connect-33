import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  type: z.enum(['affiliate', 'creator']).refine(
    (val) => val !== undefined,
    { message: 'Selecione o tipo de conta' }
  ),
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  isLoading?: boolean;
  className?: string;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ 
  onSubmit, 
  isLoading = false,
  className 
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  return (
    <form 
      onSubmit={handleSubmit(onSubmit)} 
      className={className}
      data-testid="register-form"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nome completo
          </label>
          <Input
            id="name"
            type="text"
            placeholder="Seu nome"
            error={errors.name?.message}
            {...register('name')}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Senha
          </label>
          <Input
            id="password"
            type="password"
            placeholder="Mínimo 6 caracteres"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Tipo de conta
          </label>
          <div className="grid grid-cols-2 gap-4">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="affiliate"
                className="sr-only"
                {...register('type')}
              />
              <div className="flex-1 p-3 border rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium">Afiliado</div>
                <div className="text-sm text-muted-foreground">
                  Promover produtos
                </div>
              </div>
            </label>
            
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                value="creator"
                className="sr-only"
                {...register('type')}
              />
              <div className="flex-1 p-3 border rounded-lg hover:bg-accent transition-colors">
                <div className="font-medium">Criador</div>
                <div className="text-sm text-muted-foreground">
                  Criar produtos
                </div>
              </div>
            </label>
          </div>
          {errors.type && (
            <p className="mt-1 text-sm text-destructive">
              {errors.type.message}
            </p>
          )}
        </div>

        <Button 
          type="submit" 
          loading={isLoading}
          className="w-full"
          data-testid="register-submit"
        >
          Criar conta
        </Button>
      </div>
    </form>
  );
};