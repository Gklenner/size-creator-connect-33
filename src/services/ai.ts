// AI service for content generation
// Mock implementation for now - in production would use OpenAI API

export interface AIGenerationRequest {
  type: 'instagram_post' | 'tiktok_script' | 'email_template' | 'banner_text' | 'product_description';
  productInfo: {
    title: string;
    description: string;
    category: string;
    targetAudience?: string;
    keywords?: string[];
  };
  style?: 'casual' | 'professional' | 'enthusiastic' | 'educational';
  length?: 'short' | 'medium' | 'long';
  additionalContext?: string;
}

export interface AIGenerationResponse {
  id: string;
  type: AIGenerationRequest['type'];
  content: string;
  alternatives?: string[];
  usage: {
    tokensUsed: number;
    cost: number;
  };
  generatedAt: Date;
}

export interface AITemplate {
  id: string;
  type: AIGenerationRequest['type'];
  name: string;
  template: string;
  variables: string[];
  category: string;
}

class AIService {
  private readonly GENERATIONS_KEY = 'size_ai_generations';
  private readonly USAGE_KEY = 'size_ai_usage';
  
  // Mock templates for different content types
  private readonly templates: AITemplate[] = [
    {
      id: 'ig_post_casual',
      type: 'instagram_post',
      name: 'Post Casual Instagram',
      template: `🔥 Olha só que incrível! {{title}}

{{description}}

Quem mais tá animado com isso? 👇

#{{category}} #afiliados #oportunidade`,
      variables: ['title', 'description', 'category'],
      category: 'social'
    },
    {
      id: 'tiktok_hook',
      type: 'tiktok_script',
      name: 'Script TikTok com Hook',
      template: `HOOK: "Você não vai acreditar no que descobri sobre {{category}}..."

[Mostrar o produto: {{title}}]

Pessoal, {{description}}

E o melhor de tudo? [Explicar benefício principal]

Comenta aqui embaixo se você já conhecia isso!

Link na bio 👆`,
      variables: ['title', 'description', 'category'],
      category: 'video'
    },
    {
      id: 'email_promo',
      type: 'email_template',
      name: 'Email Promocional',
      template: `Assunto: 🎯 {{title}} - Oportunidade Imperdível!

Olá!

Descobri uma oportunidade incrível que não posso deixar de compartilhar com você.

{{title}} está revolucionando {{category}} e eu consegui um acesso especial para minha comunidade.

{{description}}

Os benefícios são:
• Resultado garantido
• Suporte completo
• Preço promocional por tempo limitado

[QUERO APROVEITAR AGORA]

Um abraço,
[Seu nome]`,
      variables: ['title', 'description', 'category'],
      category: 'email'
    }
  ];

  // Generate content using AI
  async generateContent(request: AIGenerationRequest): Promise<AIGenerationResponse> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const template = this.templates.find(t => t.type === request.type);
    let content = '';

    if (template) {
      content = this.processTemplate(template.template, request.productInfo);
    } else {
      content = this.generateGenericContent(request);
    }

    // Generate alternatives
    const alternatives = await this.generateAlternatives(request, content);

    const response: AIGenerationResponse = {
      id: `ai_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: request.type,
      content,
      alternatives,
      usage: {
        tokensUsed: this.estimateTokens(content),
        cost: this.calculateCost(request.type)
      },
      generatedAt: new Date()
    };

    this.storeGeneration(response);
    this.updateUsageStats(response.usage);

    return response;
  }

  // Generate multiple variations
  async generateVariations(
    request: AIGenerationRequest, 
    count: number = 3
  ): Promise<AIGenerationResponse[]> {
    const variations: AIGenerationResponse[] = [];

    for (let i = 0; i < count; i++) {
      const variation = await this.generateContent({
        ...request,
        style: this.getRandomStyle(),
        additionalContext: `Variação ${i + 1} - Seja criativo e único`
      });
      variations.push(variation);
    }

    return variations;
  }

  // Get content suggestions based on product category
  getContentSuggestions(category: string): {
    hooks: string[];
    hashtags: string[];
    callToActions: string[];
  } {
    const suggestions = {
      'cursos': {
        hooks: [
          "O segredo que mudou minha vida em {{category}}",
          "Como consegui resultados em apenas 30 dias",
          "A técnica que 99% das pessoas não conhece"
        ],
        hashtags: ['#cursoonline', '#educacao', '#aprendizado', '#crescimento'],
        callToActions: [
          "Clique no link da bio e comece hoje mesmo!",
          "Vagas limitadas - garante a sua agora!",
          "Transforme sua vida em 30 dias!"
        ]
      },
      'marketing': {
        hooks: [
          "A estratégia secreta dos experts em marketing",
          "Como multipliquei meus resultados em 60 dias",
          "O erro que todo iniciante comete"
        ],
        hashtags: ['#marketing', '#vendas', '#empreendedorismo', '#digitalmarketing'],
        callToActions: [
          "Link na bio para começar agora!",
          "Últimas vagas disponíveis!",
          "Aproveite o desconto de lançamento!"
        ]
      },
      'tecnologia': {
        hooks: [
          "A ferramenta que está revolucionando a tecnologia",
          "Como a IA pode mudar sua carreira",
          "O futuro chegou e está aqui"
        ],
        hashtags: ['#tecnologia', '#inovacao', '#futuro', '#tech'],
        callToActions: [
          "Não fique para trás - comece hoje!",
          "Seja um dos primeiros a usar!",
          "Revolucione seu trabalho agora!"
        ]
      }
    };

    return suggestions[category.toLowerCase()] || suggestions['cursos'];
  }

  // Optimize content for specific platform
  optimizeForPlatform(content: string, platform: 'instagram' | 'tiktok' | 'email'): string {
    switch (platform) {
      case 'instagram':
        return this.optimizeForInstagram(content);
      case 'tiktok':
        return this.optimizeForTikTok(content);
      case 'email':
        return this.optimizeForEmail(content);
      default:
        return content;
    }
  }

  // Get generation history
  getGenerationHistory(limit: number = 10): AIGenerationResponse[] {
    const generations = this.getAllGenerations();
    return generations
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
      .slice(0, limit);
  }

  // Get usage statistics
  getUsageStats(): {
    totalGenerations: number;
    totalTokensUsed: number;
    totalCost: number;
    generationsByType: Record<string, number>;
    monthlyUsage: Array<{ month: string; generations: number; cost: number }>;
  } {
    const generations = this.getAllGenerations();
    const totalGenerations = generations.length;
    const totalTokensUsed = generations.reduce((sum, g) => sum + g.usage.tokensUsed, 0);
    const totalCost = generations.reduce((sum, g) => sum + g.usage.cost, 0);

    const generationsByType: Record<string, number> = {};
    generations.forEach(g => {
      generationsByType[g.type] = (generationsByType[g.type] || 0) + 1;
    });

    // Calculate monthly usage for the last 6 months
    const monthlyUsage = this.calculateMonthlyUsage(generations);

    return {
      totalGenerations,
      totalTokensUsed,
      totalCost,
      generationsByType,
      monthlyUsage
    };
  }

  // Get available templates
  getTemplates(type?: AIGenerationRequest['type']): AITemplate[] {
    if (type) {
      return this.templates.filter(t => t.type === type);
    }
    return [...this.templates];
  }

  // Save custom template
  saveCustomTemplate(template: Omit<AITemplate, 'id'>): AITemplate {
    const customTemplate: AITemplate = {
      ...template,
      id: `custom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // In a real app, this would be saved to the database
    console.log('Custom template saved:', customTemplate);

    return customTemplate;
  }

  // Private methods
  private processTemplate(template: string, productInfo: AIGenerationRequest['productInfo']): string {
    let processed = template;
    
    processed = processed.replace(/\{\{title\}\}/g, productInfo.title);
    processed = processed.replace(/\{\{description\}\}/g, productInfo.description);
    processed = processed.replace(/\{\{category\}\}/g, productInfo.category);
    
    return processed;
  }

  private generateGenericContent(request: AIGenerationRequest): string {
    const { productInfo, type } = request;
    
    switch (type) {
      case 'instagram_post':
        return `🔥 ${productInfo.title}

${productInfo.description}

#${productInfo.category} #oportunidade #afiliados`;

      case 'tiktok_script':
        return `Olha só que incrível: ${productInfo.title}!

${productInfo.description}

Quem mais quer saber sobre isso? Comenta aqui! 👇`;

      case 'email_template':
        return `Assunto: ${productInfo.title} - Oportunidade Especial!

Olá!

${productInfo.description}

[LINK PARA SABER MAIS]

Abraços!`;

      case 'banner_text':
        return `${productInfo.title}
        
${productInfo.description}

CLIQUE AQUI!`;

      case 'product_description':
        return `${productInfo.title} é a solução perfeita para quem busca resultados em ${productInfo.category}.

${productInfo.description}

Características principais:
• Qualidade garantida
• Resultados comprovados
• Suporte completo`;

      default:
        return productInfo.description;
    }
  }

  private async generateAlternatives(
    request: AIGenerationRequest, 
    originalContent: string
  ): Promise<string[]> {
    // Simulate generating 2 alternatives
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const alternatives: string[] = [];
    
    // Generate style variations
    const styles = ['casual', 'professional', 'enthusiastic'];
    for (const style of styles.slice(0, 2)) {
      const altRequest = { ...request, style: style as any };
      const altContent = this.generateGenericContent(altRequest);
      if (altContent !== originalContent) {
        alternatives.push(altContent);
      }
    }

    return alternatives;
  }

  private getRandomStyle(): AIGenerationRequest['style'] {
    const styles: AIGenerationRequest['style'][] = ['casual', 'professional', 'enthusiastic', 'educational'];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private optimizeForInstagram(content: string): string {
    // Add emoji and hashtags optimization
    let optimized = content;
    
    // Ensure it's under Instagram's character limit
    if (optimized.length > 2200) {
      optimized = optimized.substring(0, 2200) + '...';
    }
    
    // Add line breaks for better readability
    optimized = optimized.replace(/\. /g, '.\n\n');
    
    return optimized;
  }

  private optimizeForTikTok(content: string): string {
    // Add TikTok-specific optimizations
    let optimized = content;
    
    // Add hooks and engagement elements
    if (!optimized.includes('?')) {
      optimized += '\n\nO que vocês acham? Comenta aí! 👇';
    }
    
    return optimized;
  }

  private optimizeForEmail(content: string): string {
    // Add email-specific formatting
    let optimized = content;
    
    // Ensure proper email structure
    if (!optimized.includes('Assunto:')) {
      optimized = `Assunto: Oportunidade Especial!\n\n${optimized}`;
    }
    
    return optimized;
  }

  private estimateTokens(content: string): number {
    // Rough estimation: 1 token ≈ 4 characters
    return Math.ceil(content.length / 4);
  }

  private calculateCost(type: AIGenerationRequest['type']): number {
    // Mock pricing based on content type
    const pricing = {
      'instagram_post': 0.02,
      'tiktok_script': 0.03,
      'email_template': 0.04,
      'banner_text': 0.01,
      'product_description': 0.05
    };
    
    return pricing[type] || 0.02;
  }

  private storeGeneration(generation: AIGenerationResponse): void {
    const generations = this.getAllGenerations();
    generations.push(generation);
    
    // Keep only the last 100 generations
    if (generations.length > 100) {
      generations.splice(0, generations.length - 100);
    }
    
    localStorage.setItem(this.GENERATIONS_KEY, JSON.stringify(generations));
  }

  private getAllGenerations(): AIGenerationResponse[] {
    const stored = localStorage.getItem(this.GENERATIONS_KEY);
    if (!stored) return [];
    
    try {
      const generations = JSON.parse(stored);
      return generations.map((g: any) => ({
        ...g,
        generatedAt: new Date(g.generatedAt)
      }));
    } catch {
      return [];
    }
  }

  private updateUsageStats(usage: AIGenerationResponse['usage']): void {
    const currentStats = this.getStoredUsageStats();
    currentStats.totalTokens += usage.tokensUsed;
    currentStats.totalCost += usage.cost;
    currentStats.totalGenerations += 1;
    currentStats.lastUpdated = Date.now();
    
    localStorage.setItem(this.USAGE_KEY, JSON.stringify(currentStats));
  }

  private getStoredUsageStats(): {
    totalTokens: number;
    totalCost: number;
    totalGenerations: number;
    lastUpdated: number;
  } {
    const stored = localStorage.getItem(this.USAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        // Fall through to default
      }
    }
    
    return {
      totalTokens: 0,
      totalCost: 0,
      totalGenerations: 0,
      lastUpdated: Date.now()
    };
  }

  private calculateMonthlyUsage(generations: AIGenerationResponse[]): Array<{
    month: string;
    generations: number;
    cost: number;
  }> {
    const monthlyStats = new Map<string, { generations: number; cost: number }>();
    
    generations.forEach(generation => {
      const month = generation.generatedAt.toISOString().substring(0, 7); // YYYY-MM
      const current = monthlyStats.get(month) || { generations: 0, cost: 0 };
      current.generations++;
      current.cost += generation.usage.cost;
      monthlyStats.set(month, current);
    });

    return Array.from(monthlyStats.entries())
      .map(([month, stats]) => ({ month, ...stats }))
      .sort((a, b) => b.month.localeCompare(a.month))
      .slice(0, 6);
  }
}

export const aiService = new AIService();
