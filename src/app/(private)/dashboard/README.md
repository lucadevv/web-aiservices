# Private - Estructura Organizada por Features

## 📁 Estructura del Proyecto

```
(private)/
├── layout.tsx                 # Layout principal de la sección privada
├── dashboard/                 # Feature: Dashboard (Página principal)
│   ├── page.tsx              # Página principal del dashboard
│   ├── components/           # Componentes específicos del dashboard
│   ├── hooks/               # Hooks específicos del dashboard
│   ├── services/            # Servicios específicos del dashboard
│   └── models/              # Modelos/Tipos específicos del dashboard
├── ceo-ai/                   # Feature: CEO AI Management
│   ├── [id]/
│   │   └── page.tsx          # Página de detalles del CEO AI
│   ├── components/           # Componentes específicos de CEO AI
│   ├── hooks/               # Hooks específicos de CEO AI
│   ├── services/            # Servicios específicos de CEO AI
│   └── models/              # Modelos/Tipos específicos de CEO AI
├── whatsapp/                 # Feature: WhatsApp Integration
│   ├── page.tsx             # Página principal de WhatsApp
│   ├── config/
│   ├── new/
│   ├── setup/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── models/
├── billing/                  # Feature: Billing & Subscriptions
│   ├── page.tsx             # Página de facturación
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── models/
├── workflows/                # Feature: Workflow Management
│   ├── page.tsx             # Página de workflows
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── models/
├── orchestrator/             # Feature: Orchestrator
│   ├── page.tsx             # Página del orchestrator
│   ├── components/
│   ├── hooks/
│   ├── services/
│   └── models/
└── shared/                   # Recursos compartidos entre features
    ├── components/           # Componentes reutilizables
    │   ├── AddAgentModal.tsx
    │   ├── CreateCEOAIModal.tsx
    │   └── DeleteConfirmationModal.tsx
    ├── hooks/                # Hooks reutilizables
    │   └── useCEOAI.ts
    └── services/             # Servicios reutilizables
        └── ceo-ai.service.ts
```

## 🎯 Patrón de Organización

### **Por Features (Feature-Based Organization)**
Cada feature tiene su propia estructura completa:
- **components/** - Componentes específicos de la feature
- **hooks/** - Hooks específicos de la feature
- **services/** - Servicios específicos de la feature
- **models/** - Tipos/Interfaces específicos de la feature

### **Shared Resources**
Recursos compartidos entre múltiples features:
- **shared/components/** - Componentes reutilizables
- **shared/hooks/** - Hooks reutilizables
- **shared/services/** - Servicios reutilizables

## 🔄 Flujo de Datos

```
Page → Component → Hook → Service → ApiService → Backend
```

### Ejemplo: Creación de CEO AI
1. **Page**: `dashboard/page.tsx` → `handleCreateCEOAI`
2. **Component**: `CreateCEOAIModal` → `onSubmit`
3. **Hook**: `useCEOAI.createCEOAI()` → `ceoAIService.createCEOAI()`
4. **Service**: `ceo-ai.service.ts` → `apiService.post()`
5. **ApiService**: `api.service.ts` → Backend API
6. **Backend**: `ceoAIController.createCEOAI()` → `n8nService.createCEOAIWorkflow()`

### Ejemplo: Creación de Agente
1. **Page**: `ceo-ai/[id]/page.tsx` → `handleSubmitAgent`
2. **Component**: `AddAgentModal` → `onSubmit`
3. **Hook**: `useCEOAI.createAgent()` → `ceoAIService.addSpecializedAgent()`
4. **Service**: `ceo-ai.service.ts` → `apiService.post()`
5. **ApiService**: `api.service.ts` → Backend API
6. **Backend**: `ceoAIController.addAgent()` → `n8nService.createAgentWorkflow()`

## 📋 Archivos Eliminados (No Utilizados)

- ❌ `hooks/useAgents.ts` - No se usaba en ningún lugar
- ❌ `hooks/useConversations.ts` - No se usaba en ningún lugar
- ❌ `workflows/services/workflow.service.ts` - No se usaba en ningún lugar
- ❌ `billing/services/billing.service.ts` - No se usaba (se usa el hook directamente)
- ❌ Directorios vacíos eliminados
- ✅ **Reorganización**: Dashboard ahora es una feature completa con su propia estructura

## 🚀 Beneficios de esta Estructura

1. **Escalabilidad**: Cada feature es independiente
2. **Mantenibilidad**: Código organizado y fácil de encontrar
3. **Reutilización**: Componentes y servicios compartidos
4. **Separación de Responsabilidades**: Cada feature maneja su propia lógica
5. **Patrón Consistente**: Misma estructura en todas las features 