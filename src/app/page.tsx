"use client"

import { useState, useEffect } from 'react'
import { Calendar, ChefHat, DollarSign, TrendingDown, BarChart3, CheckCircle, Circle, User, Target, ShoppingCart } from 'lucide-react'

interface Meal {
  id: string
  type: 'breakfast' | 'lunch' | 'snack' | 'dinner'
  option1: string
  option2: string
  completed: boolean
}

interface WeekData {
  week: number
  meals: Meal[]
}

const initialWeeksData: WeekData[] = [
  {
    week: 1,
    meals: [
      { id: '1-breakfast', type: 'breakfast', option1: '3 ovos cozidos + café preto', option2: 'Omelete (2 ovos + 2 claras) + 50g soja', completed: false },
      { id: '1-lunch', type: 'lunch', option1: '120g frango + 100g soja + salada', option2: 'Frango desfiado + omelete 2 ovos', completed: false },
      { id: '1-snack', type: 'snack', option1: '2 ovos + 50g soja', option2: '3 claras + 1 ovo + pepino', completed: false },
      { id: '1-dinner', type: 'dinner', option1: '120g frango + 80g soja', option2: '3 ovos mexidos + legumes', completed: false },
    ]
  },
  {
    week: 2,
    meals: [
      { id: '2-breakfast', type: 'breakfast', option1: 'Panqueca de ovos + soja', option2: 'Ovo pochê + salada de pepino', completed: false },
      { id: '2-lunch', type: 'lunch', option1: 'Frango desfiado + soja + vinagrete', option2: 'Frango grelhado + ovos + brócolis', completed: false },
      { id: '2-snack', type: 'snack', option1: 'Omelete + soja + cheiro-verde', option2: '1 ovo + 2 claras + repolho', completed: false },
      { id: '2-dinner', type: 'dinner', option1: 'Frango assado + soja + couve', option2: '2 ovos cozidos + 1 mexido + legumes', completed: false },
    ]
  },
  {
    week: 3,
    meals: [
      { id: '3-breakfast', type: 'breakfast', option1: '2 ovos + soja + folhas', option2: 'Omelete enrolada com soja', completed: false },
      { id: '3-lunch', type: 'lunch', option1: 'Frango desfiado + soja + limão', option2: '150g frango + 1 ovo + abobrinha', completed: false },
      { id: '3-snack', type: 'snack', option1: '2 ovos + soja + limão', option2: '2 claras + 1 ovo + pepino', completed: false },
      { id: '3-dinner', type: 'dinner', option1: 'Frango grelhado + soja + couve', option2: 'Omelete 3 ovos + soja + legumes', completed: false },
    ]
  }
]

const mealTypeNames = {
  breakfast: 'Café da Manhã',
  lunch: 'Almoço',
  snack: 'Lanche',
  dinner: 'Jantar'
}

const seasonings = [
  'Sal marinho ou rosa (moderado)',
  'Alho, cebola, limão, vinagre',
  'Pimenta-do-reino, orégano, cúrcuma, páprica',
  'Coentro, cebolinha, manjericão',
  'Cominho, noz-moscada'
]

const preparationMethods = [
  'Grelhar frango e ovos sem óleo',
  'Cozinhar ovos e soja em lotes',
  'Desfiar frango para misturar com soja',
  'Fazer omelete ou panqueca de ovos',
  'Saltear soja com alho e cebola'
]

const costData = [
  { food: 'Soja', dailyQty: '250g', dailyCost: 'R$ 2,50', totalCost: 'R$ 52,50' },
  { food: 'Ovos', dailyQty: '5 unid.', dailyCost: 'R$ 3,00', totalCost: 'R$ 63,00' },
  { food: 'Frango', dailyQty: '250g', dailyCost: 'R$ 4,00', totalCost: 'R$ 84,00' }
]

export default function DietApp() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [activeWeek, setActiveWeek] = useState(1)
  const [weeksData, setWeeksData] = useState<WeekData[]>(initialWeeksData)
  const [initialWeight, setInitialWeight] = useState('')
  const [currentWeight, setCurrentWeight] = useState('')
  const [isReduced, setIsReduced] = useState(false)
  const [currentDay, setCurrentDay] = useState(1)

  useEffect(() => {
    const saved = localStorage.getItem('dietAppData')
    if (saved) {
      const data = JSON.parse(saved)
      setWeeksData(data.weeksData || initialWeeksData)
      setInitialWeight(data.initialWeight || '')
      setCurrentWeight(data.currentWeight || '')
      setIsReduced(data.isReduced || false)
      setCurrentDay(data.currentDay || 1)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('dietAppData', JSON.stringify({
      weeksData,
      initialWeight,
      currentWeight,
      isReduced,
      currentDay
    }))
  }, [weeksData, initialWeight, currentWeight, isReduced, currentDay])

  const toggleMealCompletion = (weekIndex: number, mealId: string) => {
    setWeeksData(prev => prev.map((week, idx) => 
      idx === weekIndex 
        ? {
            ...week,
            meals: week.meals.map(meal => 
              meal.id === mealId 
                ? { ...meal, completed: !meal.completed }
                : meal
            )
          }
        : week
    ))
  }

  const getCompletedMeals = () => {
    return weeksData.reduce((total, week) => 
      total + week.meals.filter(meal => meal.completed).length, 0
    )
  }

  const getWeightLoss = () => {
    if (!initialWeight || !currentWeight) return 0
    return parseFloat(initialWeight) - parseFloat(currentWeight)
  }

  const startNewCycle = () => {
    setIsReduced(true)
    setCurrentDay(1)
    setWeeksData(initialWeeksData.map(week => ({
      ...week,
      meals: week.meals.map(meal => ({ ...meal, completed: false }))
    })))
  }

  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="text-center bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-2xl border border-green-200">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Dieta da Soja, Ovo e Frango</h1>
        <p className="text-lg text-green-700 mb-4">
          Perca de 5 a 9 kg em 21 dias com uma dieta prática, barata e rica em proteínas.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            <input
              type="number"
              placeholder="Peso inicial (kg)"
              value={initialWeight}
              onChange={(e) => setInitialWeight(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-green-600" />
            <input
              type="number"
              placeholder="Peso final depois do desafio (kg)"
              value={currentWeight}
              onChange={(e) => setCurrentWeight(e.target.value)}
              className="px-3 py-2 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>
        {initialWeight && currentWeight && (
          <div className="mt-4 p-4 bg-white rounded-lg border border-green-200">
            <p className="text-green-800 font-semibold">
              Perda de peso: {getWeightLoss().toFixed(1)} kg
            </p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <button
          onClick={() => setActiveTab('menu')}
          className="p-6 bg-white rounded-2xl border border-green-200 hover:border-green-400 hover:shadow-lg transition-all duration-300 text-left group"
        >
          <Calendar className="w-8 h-8 text-green-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">Cardápio Semanal</h3>
          <p className="text-sm text-gray-600">84 refeições planejadas</p>
        </button>

        <button
          onClick={() => setActiveTab('seasonings')}
          className="p-6 bg-white rounded-2xl border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all duration-300 text-left group"
        >
          <ChefHat className="w-8 h-8 text-yellow-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">Temperos & Preparo</h3>
          <p className="text-sm text-gray-600">Dicas de preparação</p>
        </button>

        <button
          onClick={() => setActiveTab('reduction')}
          className="p-6 bg-white rounded-2xl border border-orange-200 hover:border-orange-400 hover:shadow-lg transition-all duration-300 text-left group"
        >
          <TrendingDown className="w-8 h-8 text-orange-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">Redução de 30%</h3>
          <p className="text-sm text-gray-600">Para repetir a dieta</p>
        </button>

        <button
          onClick={() => setActiveTab('costs')}
          className="p-6 bg-white rounded-2xl border border-blue-200 hover:border-blue-400 hover:shadow-lg transition-all duration-300 text-left group"
        >
          <DollarSign className="w-8 h-8 text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
          <h3 className="font-semibold text-gray-800 mb-1">Custos & Compras</h3>
          <p className="text-sm text-gray-600">R$ 9,50/dia</p>
        </button>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <BarChart3 className="w-6 h-6 text-green-600" />
          <h3 className="text-xl font-semibold text-gray-800">Progresso</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">{currentDay}/21</p>
            <p className="text-sm text-green-700">Dias completados</p>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">{getCompletedMeals()}/84</p>
            <p className="text-sm text-blue-700">Refeições feitas</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <p className="text-2xl font-bold text-yellow-600">R$ 9,50</p>
            <p className="text-sm text-yellow-700">Custo diário</p>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMenu = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">Cardápio Semanal</h2>
        <div className="flex gap-2">
          {[1, 2, 3].map(week => (
            <button
              key={week}
              onClick={() => setActiveWeek(week)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeWeek === week
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              Semana {week}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        {weeksData[activeWeek - 1]?.meals.map((meal, index) => (
          <div key={meal.id} className="bg-white p-6 rounded-2xl border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                {mealTypeNames[meal.type]}
              </h3>
              <button
                onClick={() => toggleMealCompletion(activeWeek - 1, meal.id)}
                className="flex items-center gap-2 text-green-600 hover:text-green-700"
              >
                {meal.completed ? (
                  <CheckCircle className="w-6 h-6" />
                ) : (
                  <Circle className="w-6 h-6" />
                )}
                <span className="text-sm font-medium">
                  {meal.completed ? 'Concluída' : 'Marcar'}
                </span>
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Opção 1</h4>
                <p className="text-green-700">{meal.option1}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-medium text-blue-800 mb-2">Opção 2</h4>
                <p className="text-blue-700">{meal.option2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const renderSeasonings = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Temperos & Preparo</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-green-200">
          <h3 className="text-xl font-semibold text-green-800 mb-4">Temperos Liberados</h3>
          <ul className="space-y-3">
            {seasonings.map((seasoning, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{seasoning}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-yellow-200">
          <h3 className="text-xl font-semibold text-yellow-800 mb-4">Formas de Preparo</h3>
          <ul className="space-y-3">
            {preparationMethods.map((method, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2 flex-shrink-0"></div>
                <span className="text-gray-700">{method}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-yellow-50 p-6 rounded-2xl border border-green-200">
        <h3 className="text-lg font-semibold text-green-800 mb-3">💡 Dicas Importantes</h3>
        <ul className="space-y-2 text-green-700">
          <li>• Beba de 3 a 3,5L de água por dia</li>
          <li>• Prepare os alimentos em lotes para facilitar</li>
          <li>• Varie os temperos para não enjoar</li>
          <li>• Verduras e legumes são livres</li>
        </ul>
      </div>
    </div>
  )

  const renderReduction = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Redução de 30%</h2>
      
      <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200">
        <h3 className="text-xl font-semibold text-orange-800 mb-4">
          Para repetir a dieta após 21 dias
        </h3>
        <p className="text-orange-700 mb-6">
          Caso não tenha atingido a meta desejada, reduza as porções em 30% e reinicie o ciclo.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Frango</h4>
            <p className="text-gray-700">120g → 85g por refeição</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Ovos</h4>
            <p className="text-gray-700">3 ovos → 2 ovos (ou 2 ovos + 1 clara)</p>
          </div>
          <div className="bg-white p-4 rounded-lg border border-orange-200">
            <h4 className="font-semibold text-orange-800 mb-2">Soja</h4>
            <p className="text-gray-700">100g → 70g por refeição</p>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border border-green-200 mb-6">
          <h4 className="font-semibold text-green-800 mb-2">✅ Manter</h4>
          <ul className="text-green-700 space-y-1">
            <li>• Legumes e verduras livres</li>
            <li>• Hidratação de 3 a 3,5L/dia</li>
            <li>• Temperos naturais</li>
          </ul>
        </div>

        <button
          onClick={startNewCycle}
          className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105"
        >
          🔄 Iniciar Novo Ciclo (Reduzido)
        </button>
        
        {isReduced && (
          <div className="mt-4 p-4 bg-green-100 rounded-lg border border-green-300">
            <p className="text-green-800 font-medium">
              ✅ Modo reduzido ativado! As porções foram reduzidas em 30%.
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const renderCosts = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Custos & Lista de Compras</h2>
      
      <div className="bg-white p-6 rounded-2xl border border-blue-200">
        <h3 className="text-xl font-semibold text-blue-800 mb-4">Custos Estimados</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-blue-200">
                <th className="text-left py-3 px-4 font-semibold text-blue-800">Alimento</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-800">Qtd. diária</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-800">Custo/dia</th>
                <th className="text-left py-3 px-4 font-semibold text-blue-800">21 dias</th>
              </tr>
            </thead>
            <tbody>
              {costData.map((item, index) => (
                <tr key={index} className="border-b border-blue-100">
                  <td className="py-3 px-4 text-gray-700">{item.food}</td>
                  <td className="py-3 px-4 text-gray-700">{item.dailyQty}</td>
                  <td className="py-3 px-4 text-gray-700">{item.dailyCost}</td>
                  <td className="py-3 px-4 text-gray-700">{item.totalCost}</td>
                </tr>
              ))}
              <tr className="bg-blue-50 font-semibold">
                <td className="py-3 px-4 text-blue-800">Total</td>
                <td className="py-3 px-4 text-blue-800">—</td>
                <td className="py-3 px-4 text-blue-800">R$ 9,50/dia</td>
                <td className="py-3 px-4 text-blue-800">R$ 199,50</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-6 h-6 text-green-600" />
            <h3 className="text-xl font-semibold text-green-800">Lista Semanal</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li>• 1,75 kg de soja crua</li>
            <li>• 35 ovos</li>
            <li>• 1,75 kg de peito de frango</li>
            <li>• Verduras e temperos naturais à vontade</li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-yellow-200">
          <div className="flex items-center gap-2 mb-4">
            <ShoppingCart className="w-6 h-6 text-yellow-600" />
            <h3 className="text-xl font-semibold text-yellow-800">Lista 21 dias</h3>
          </div>
          <ul className="space-y-2 text-gray-700">
            <li>• 5,25 kg de soja</li>
            <li>• 105 ovos</li>
            <li>• 5,25 kg de frango</li>
            <li>• Verduras e temperos naturais</li>
          </ul>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-yellow-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Navigation */}
        <nav className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
              { id: 'menu', label: 'Cardápio', icon: Calendar },
              { id: 'seasonings', label: 'Temperos', icon: ChefHat },
              { id: 'reduction', label: 'Redução 30%', icon: TrendingDown },
              { id: 'costs', label: 'Custos', icon: DollarSign }
            ].map(tab => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-green-50 hover:text-green-600 border border-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </nav>

        {/* Content */}
        <main>
          {activeTab === 'dashboard' && renderDashboard()}
          {activeTab === 'menu' && renderMenu()}
          {activeTab === 'seasonings' && renderSeasonings()}
          {activeTab === 'reduction' && renderReduction()}
          {activeTab === 'costs' && renderCosts()}
        </main>
      </div>
    </div>
  )
}