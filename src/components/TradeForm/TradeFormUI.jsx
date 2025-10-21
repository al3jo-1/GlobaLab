import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { formatCurrency } from '@/lib/market-data';
import { motion } from 'framer-motion';
import { Switch } from "@/components/ui/switch";

const TradeFormUI = ({
  selectedSymbol,
  currentPrice, // Price in asset's original currency
  assetCurrency, // Original currency of the asset
  userCurrency,  // Always USD for user interactions
  tradeMode, setTradeMode,
  amount, setAmount,
  quantity, setQuantity,
  tradeType, setTradeType,
  justification, setJustification,
  attachmentName,
  handleFileChange,
  handleSubmit,
  totalCostUSD, // This is the calculated cost in USD
  userBalance,
  isStock,
}) => {

  const renderFormContent = (type) => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        {isStock && (
          <div className="flex items-center space-x-2 mb-3">
            <Label htmlFor={`trade-mode-${type}`} className={tradeMode === 'amount' ? 'font-semibold' : 'text-muted-foreground'}>Invertir por Monto</Label>
            <Switch
              id={`trade-mode-${type}`}
              checked={tradeMode === 'quantity'}
              onCheckedChange={(checked) => setTradeMode(checked ? 'quantity' : 'amount')}
            />
            <Label htmlFor={`trade-mode-${type}`} className={tradeMode === 'quantity' ? 'font-semibold' : 'text-muted-foreground'}>Comprar por Cantidad</Label>
          </div>
        )}

        {tradeMode === 'amount' ? (
          <div className="space-y-1">
            <Label htmlFor={`${type}-amount`}>Monto a invertir ({userCurrency})</Label>
            <Input
              id={`${type}-amount`}
              type="number"
              placeholder={`Monto en ${userCurrency}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="any"
            />
          </div>
        ) : ( // tradeMode === 'quantity'
          <div className="space-y-1">
            <Label htmlFor={`${type}-quantity`}>Cantidad de Acciones</Label>
            <Input
              id={`${type}-quantity`}
              type="number"
              placeholder="Número de acciones"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.000001" // Allow fractional for some assets potentially
              step="any"
            />
          </div>
        )}
        
        {tradeMode === 'quantity' && parseFloat(quantity) > 0 && currentPrice > 0 && (
          <p className="text-xs text-muted-foreground">
            Costo total estimado: {formatCurrency(totalCostUSD, userCurrency)}
          </p>
        )}


        <div className="space-y-1">
          <Label htmlFor={`${type}-justification`}>Justificación de la operación</Label>
          <Textarea
            id={`${type}-justification`}
            placeholder="¿Por qué estás realizando esta operación?"
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`${type}-attachment`}>Adjuntar imagen (Opcional, PNG/JPG, máx 2MB)</Label>
          <Input
            id={`${type}-attachment`}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="text-xs file:text-foreground"
          />
          {attachmentName && <p className="text-xs text-muted-foreground mt-1">Archivo: {attachmentName}</p>}
        </div>
        
        <div className="space-y-1">
          <Label>Saldo disponible</Label>
          <p className="text-sm font-medium">{formatCurrency(userBalance, userCurrency)}</p>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            className={`w-full ${type === 'BUY' ? 'bg-green-500 hover:bg-green-500/90 text-white' : 'bg-red-500 hover:bg-red-500/90 text-white'}`}
            disabled={!userBalance || userBalance <=0 || totalCostUSD > userBalance || !justification.trim() || totalCostUSD <= 0}
          >
            {type === 'BUY' ? 'Comprar' : 'Vender'} {selectedSymbol}
          </Button>
        </motion.div>
      </div>
    </form>
  );

  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">Operar {selectedSymbol}</h2>
      <p className="text-sm text-muted-foreground mb-3">
        Precio actual: <span className="font-medium">{formatCurrency(currentPrice, assetCurrency)}</span>
        {/* Optional: Display an approximate USD price if assetCurrency is not USD.
            This would require an exchange rate. For now, focusing on USD investment.
            (aprox. ${formatCurrency(currentPriceInUSD, userCurrency)}) 
        */}
      </p>
      
      <Tabs defaultValue="BUY" onValueChange={setTradeType}>
        <TabsList className="grid grid-cols-2 mb-3">
          <TabsTrigger value="BUY" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">Comprar</TabsTrigger>
          <TabsTrigger value="SELL" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400">Vender</TabsTrigger>
        </TabsList>
        
        <TabsContent value="BUY">
          {renderFormContent('BUY')}
        </TabsContent>
        
        <TabsContent value="SELL">
          {renderFormContent('SELL')}
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="mb-1">Información importante:</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>Todas las operaciones son simuladas con dinero virtual ({userCurrency}).</li>
          <li>Los precios se actualizan para simular el mercado.</li>
          <li>Puedes cerrar tus posiciones desde la sección de Posiciones.</li>
          <li>La justificación es obligatoria para cada operación.</li>
        </ul>
      </div>
    </div>
  );
};

export default TradeFormUI;