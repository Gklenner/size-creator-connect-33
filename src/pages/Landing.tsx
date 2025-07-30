import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Users, 
  TrendingUp, 
  DollarSign, 
  Zap,
  Shield,
  BarChart3,
  Target,
  Sparkles,
  CheckCircle
} from "lucide-react";

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: "Conecte-se com Afiliados",
      description: "Encontre os melhores afiliados para promover seus produtos digitais",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Analytics Avançado",
      description: "Acompanhe cliques, conversões e ganhos em tempo real",
      color: "text-success"
    },
    {
      icon: DollarSign,
      title: "Comissões Automáticas",
      description: "Sistema transparente de tracking e pagamento de comissões",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Materiais Prontos",
      description: "Acesse templates, banners e scripts otimizados para conversão",
      color: "text-warning"
    }
  ];

  const testimonials = [
    {
      name: "Marina Silva",
      role: "Produtora Digital",
      content: "Aumentei minhas vendas em 300% em apenas 2 meses usando a Size. A qualidade dos afiliados é excepcional!",
      avatar: "MS"
    },
    {
      name: "Carlos Mendes",
      role: "Afiliado Premium",
      content: "Finalmente encontrei uma plataforma que me oferece produtos de qualidade e materiais profissionais.",
      avatar: "CM"
    },
    {
      name: "Ana Paula",
      role: "Criadora de Conteúdo",
      content: "O sistema de analytics da Size me ajuda a entender exatamente o que funciona nas minhas campanhas.",
      avatar: "AP"
    }
  ];

  const plans = [
    {
      name: "Afiliado",
      price: "Gratuito",
      description: "Para quem quer começar a promover produtos",
      features: [
        "Acesso a todos os produtos",
        "Materiais básicos",
        "Analytics básico",
        "Suporte por email"
      ],
      cta: "Começar Agora",
      popular: false
    },
    {
      name: "Produtor",
      price: "R$ 97/mês",
      description: "Para criadores que querem escalar suas vendas",
      features: [
        "Produtos ilimitados",
        "Analytics avançado",
        "IA para criação de materiais",
        "Suporte prioritário",
        "Automações de email"
      ],
      cta: "Teste 30 Dias Grátis",
      popular: true
    },
    {
      name: "Agência",
      price: "R$ 297/mês",
      description: "Para agências e grandes produtores",
      features: [
        "Multi-produtos",
        "White-label",
        "API personalizada",
        "Gerente de conta",
        "Treinamentos exclusivos"
      ],
      cta: "Falar com Vendas",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                Size
              </h1>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
                Recursos
              </a>
              <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                Como Funciona
              </a>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Preços
              </a>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={() => window.location.href = '/login'}>
                Entrar
              </Button>
              <Button className="bg-gradient-primary" onClick={() => window.location.href = '/register'}>
                Cadastrar
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Plataforma #1 em Afiliação Digital
            </Badge>
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Conectamos
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Produtores </span>
              e
              <span className="bg-gradient-primary bg-clip-text text-transparent"> Afiliados</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              A plataforma mais completa para impulsionar suas vendas digitais. 
              Materiais prontos, analytics avançado e IA para maximizar suas conversões.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-primary text-lg px-8 py-3" 
                onClick={() => window.location.href = "/register"}
              >
                Começar Gratuitamente
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-3"
                onClick={() => window.location.href = "/login"}
              >
                Ver Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Tudo que você precisa para vender mais
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ferramentas profissionais que transformam a maneira como você trabalha com afiliação
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-glow transition-all duration-300">
                <CardHeader>
                  <div className={`w-12 h-12 mx-auto mb-4 rounded-lg bg-gradient-primary/10 flex items-center justify-center`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Como funciona a Size
            </h2>
            <p className="text-xl text-muted-foreground">
              Processo simples e eficiente para começar a vender
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-4">Cadastre-se</h3>
              <p className="text-muted-foreground">
                Crie sua conta em menos de 2 minutos e escolha se você é produtor ou afiliado
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-4">Conecte-se</h3>
              <p className="text-muted-foreground">
                Produtores publicam produtos, afiliados escolhem os melhores para promover
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-4">Lucre Mais</h3>
              <p className="text-muted-foreground">
                Use nossos materiais e analytics para maximizar suas vendas e comissões
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              O que nossos usuários dizem
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="hover:shadow-glow transition-all duration-300">
                <CardContent className="pt-6">
                  <p className="text-muted-foreground mb-6">"{testimonial.content}"</p>
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-semibold mr-3">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Escolha seu plano
            </h2>
            <p className="text-xl text-muted-foreground">
              Soluções para cada etapa da sua jornada
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans.map((plan, index) => (
              <Card key={index} className={`relative hover:shadow-glow transition-all duration-300 ${plan.popular ? 'border-primary shadow-primary' : ''}`}>
                {plan.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-primary">
                    Mais Popular
                  </Badge>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary">{plan.price}</div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  {plan.features.map((feature, i) => (
                    <div key={i} className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-success mr-3" />
                      <span>{feature}</span>
                    </div>
                  ))}
                  <Button 
                    className={`w-full mt-6 ${plan.popular ? 'bg-gradient-primary' : ''}`}
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => window.location.href = "/register"}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Pronto para revolucionar suas vendas?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Junte-se a milhares de produtores e afiliados que já estão lucrando com a Size
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 text-lg px-8 py-3"
            onClick={() => window.location.href = "/register"}
          >
            Começar Agora - Grátis
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
                Size
              </h3>
              <p className="text-muted-foreground">
                A plataforma que conecta produtores e afiliados para maximizar vendas digitais.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Produto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Recursos</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Preços</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Suporte</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Centro de Ajuda</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contato</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Empresa</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Sobre</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Carreiras</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Size Platform. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}