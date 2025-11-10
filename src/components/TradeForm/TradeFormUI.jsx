import React from 'react';
import { useTranslation } from 'react-i18next';
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
  automationRules,
  updateAutomationRule,
}) => {
  const { t } = useTranslation();

  const renderFormContent = (type) => (
    <form onSubmit={handleSubmit}>
      <div className="space-y-3">
        {isStock && (
          <div className="flex items-center space-x-2 mb-3">
            <Label htmlFor={`trade-mode-${type}`} className={tradeMode === 'amount' ? 'font-semibold' : 'text-muted-foreground'}>{t('trade.mode_amount', { defaultValue: 'Invest by Amount' })}</Label>
            <Switch
              id={`trade-mode-${type}`}
              checked={tradeMode === 'quantity'}
              onCheckedChange={(checked) => setTradeMode(checked ? 'quantity' : 'amount')}
            />
            <Label htmlFor={`trade-mode-${type}`} className={tradeMode === 'quantity' ? 'font-semibold' : 'text-muted-foreground'}>{t('trade.mode_quantity', { defaultValue: 'Buy by Quantity' })}</Label>
          </div>
        )}

        {tradeMode === 'amount' ? (
          <div className="space-y-1">
            <Label htmlFor={`${type}-amount`}>{t('trading.amount')} ({userCurrency})</Label>
            <Input
              id={`${type}-amount`}
              type="number"
              placeholder={`${t('trading.amount')} ${userCurrency}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="0.01"
              step="any"
            />
          </div>
        ) : ( // tradeMode === 'quantity'
          <div className="space-y-1">
            <Label htmlFor={`${type}-quantity`}>{t('trading.quantity')}</Label>
            <Input
              id={`${type}-quantity`}
              type="number"
              placeholder={t('trading.quantity')}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="0.000001" // Allow fractional for some assets potentially
              step="any"
            />
          </div>
        )}
        
        {tradeMode === 'quantity' && parseFloat(quantity) > 0 && currentPrice > 0 && (
          <p className="text-xs text-muted-foreground">
            {t('trade.estimated_total', { defaultValue: 'Estimated total' })}: {formatCurrency(totalCostUSD, userCurrency)}
          </p>
        )}

        <div className="border-t border-muted-foreground/20 pt-3 mt-3 space-y-2">
          <Label className="text-sm font-semibold">{t('trade.automation_optional', { defaultValue: 'Automation (Optional)' })}</Label>
          
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`${type}-takeProfit`} className="text-xs">{t('trade.take_profit', { defaultValue: 'Take Profit' })}</Label>
              <Input
                id={`${type}-takeProfit`}
                type="number"
                placeholder={assetCurrency}
                value={automationRules.takeProfit}
                onChange={(e) => updateAutomationRule('takeProfit', e.target.value)}
                min="0.000001"
                step="any"
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                {type === 'BUY' 
                  ? t('trade.tp_hint_buy', { defaultValue: '> current price' })
                  : t('trade.tp_hint_sell', { defaultValue: '< current price' })}
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`${type}-stopLoss`} className="text-xs">{t('trade.stop_loss', { defaultValue: 'Stop Loss' })}</Label>
              <Input
                id={`${type}-stopLoss`}
                type="number"
                placeholder={assetCurrency}
                value={automationRules.stopLoss}
                onChange={(e) => updateAutomationRule('stopLoss', e.target.value)}
                min="0.000001"
                step="any"
                className="h-8 text-xs"
              />
              <p className="text-[10px] text-muted-foreground">
                {type === 'BUY' 
                  ? t('trade.sl_hint_buy', { defaultValue: '< current price' })
                  : t('trade.sl_hint_sell', { defaultValue: '> current price' })}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label htmlFor={`${type}-buyLimit`} className="text-xs">{t('trade.buy_limit', { defaultValue: 'Buy Limit' })}</Label>
              <Input
                id={`${type}-buyLimit`}
                type="number"
                placeholder={type === 'BUY' ? assetCurrency : t('trade.not_applicable', { defaultValue: 'N/A' })}
                value={automationRules.buyLimit}
                onChange={(e) => updateAutomationRule('buyLimit', e.target.value)}
                min="0.000001"
                step="any"
                className="h-8 text-xs"
                disabled={type === 'SELL'}
              />
              <p className="text-[10px] text-muted-foreground">
                {type === 'BUY' 
                  ? t('trade.bl_hint', { defaultValue: 'Execute when price drops' })
                  : t('trade.only_for_buy', { defaultValue: 'Only for BUY' })}
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor={`${type}-sellLimit`} className="text-xs">{t('trade.sell_limit', { defaultValue: 'Sell Limit' })}</Label>
              <Input
                id={`${type}-sellLimit`}
                type="number"
                placeholder={type === 'SELL' ? assetCurrency : t('trade.not_applicable', { defaultValue: 'N/A' })}
                value={automationRules.sellLimit}
                onChange={(e) => updateAutomationRule('sellLimit', e.target.value)}
                min="0.000001"
                step="any"
                className="h-8 text-xs"
                disabled={type === 'BUY'}
              />
              <p className="text-[10px] text-muted-foreground">
                {type === 'SELL' 
                  ? t('trade.sll_hint', { defaultValue: 'Execute when price rises' })
                  : t('trade.only_for_sell', { defaultValue: 'Only for SELL' })}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor={`${type}-justification`}>{t('trading.justification', { defaultValue: 'Justification' })}</Label>
          <Textarea
            id={`${type}-justification`}
            placeholder={t('trade.justification_placeholder', { defaultValue: 'Why are you making this trade?' })}
            value={justification}
            onChange={(e) => setJustification(e.target.value)}
            rows={3}
          />
        </div>

        <div className="space-y-1">
          <Label htmlFor={`${type}-attachment`}>{t('trade.attachment_label', { defaultValue: 'Attach image (Optional, PNG/JPG, max 2MB)' })}</Label>
          <Input
            id={`${type}-attachment`}
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            onChange={handleFileChange}
            className="text-xs file:text-foreground"
          />
          {attachmentName && <p className="text-xs text-muted-foreground mt-1">{t('trade.file', { defaultValue: 'File' })}: {attachmentName}</p>}
        </div>
        
        <div className="space-y-1">
          <Label>{t('trade.available_balance', { defaultValue: 'Available balance' })}</Label>
          <p className="text-sm font-medium">{formatCurrency(userBalance, userCurrency)}</p>
        </div>
        
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button 
            type="submit" 
            className={`w-full ${type === 'BUY' ? 'bg-green-500 hover:bg-green-500/90 text-white' : 'bg-red-500 hover:bg-red-500/90 text-white'}`}
            disabled={!userBalance || userBalance <=0 || totalCostUSD > userBalance || !justification.trim() || totalCostUSD <= 0}
          >
            {type === 'BUY' ? t('trading.buy') : t('trading.sell')} {selectedSymbol}
          </Button>
        </motion.div>
      </div>
    </form>
  );

  return (
    <div className="glass-card rounded-lg p-4">
      <h2 className="text-xl font-bold mb-2">{(tradeType === 'SELL' ? t('trading.sell') : t('trading.buy'))} {selectedSymbol}</h2>
      <p className="text-sm text-muted-foreground mb-3">
        {t('trading.market_price')}: <span className="font-medium">{formatCurrency(currentPrice, assetCurrency)}</span>
        {/* Optional: Display an approximate USD price if assetCurrency is not USD.
            This would require an exchange rate. For now, focusing on USD investment.
            (aprox. ${formatCurrency(currentPriceInUSD, userCurrency)}) 
        */}
      </p>
      
      <Tabs defaultValue="BUY" onValueChange={setTradeType}>
        <TabsList className="grid grid-cols-2 mb-3">
          <TabsTrigger value="BUY" className="data-[state=active]:bg-green-500/20 data-[state=active]:text-green-600 dark:data-[state=active]:text-green-400">{t('trading.buy')}</TabsTrigger>
          <TabsTrigger value="SELL" className="data-[state=active]:bg-red-500/20 data-[state=active]:text-red-600 dark:data-[state=active]:text-red-400">{t('trading.sell')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="BUY">
          {renderFormContent('BUY')}
        </TabsContent>
        
        <TabsContent value="SELL">
          {renderFormContent('SELL')}
        </TabsContent>
      </Tabs>
      
      <div className="mt-4 text-xs text-muted-foreground">
        <p className="mb-1">{t('trade.important_info', { defaultValue: 'Important information' })}:</p>
        <ul className="list-disc pl-4 space-y-0.5">
          <li>{t('trade.note_virtual', { defaultValue: 'All trades are simulated with virtual money' })} ({userCurrency}).</li>
          <li>{t('trade.note_prices', { defaultValue: 'Prices update to simulate the market.' })}</li>
          <li>{t('trade.note_close_positions', { defaultValue: 'You can close positions from the Positions section.' })}</li>
          <li>{t('trade.note_justification', { defaultValue: 'A justification is required for each trade.' })}</li>
        </ul>
      </div>
    </div>
  );
};

export default TradeFormUI;