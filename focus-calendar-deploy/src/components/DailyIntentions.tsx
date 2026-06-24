'use client';

import { useState } from 'react';
import { DayFocus } from '@/lib/types';
import { 
  Target, 
  Zap, 
  Shield, 
  Edit2, 
  Check,
  X,
  Plus,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DailyIntentionsProps {
  focus: DayFocus;
  onUpdateFocus: (focus: DayFocus) => void;
}

export function DailyIntentions({ focus, onUpdateFocus }: DailyIntentionsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedGoal, setEditedGoal] = useState(focus.mainGoal);
  const [editedDistractions, setEditedDistractions] = useState(focus.distractionsToAvoid);
  const [newDistraction, setNewDistraction] = useState('');

  const handleSave = () => {
    onUpdateFocus({
      ...focus,
      mainGoal: editedGoal,
      distractionsToAvoid: editedDistractions,
    });
    setIsEditing(false);
  };

  const addDistraction = () => {
    if (newDistraction.trim()) {
      setEditedDistractions([...editedDistractions, newDistraction.trim()]);
      setNewDistraction('');
    }
  };

  const removeDistraction = (index: number) => {
    setEditedDistractions(editedDistractions.filter((_, i) => i !== index));
  };

  return (
    <div className="rounded-2xl bg-slate-800/30 border border-slate-700/50 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-200">Daily Intentions</h2>
        </div>
        <button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="p-2 rounded-lg bg-slate-700/50 text-slate-400 hover:bg-slate-600/50 hover:text-slate-200 transition-all"
        >
          {isEditing ? <Check className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
        </button>
      </div>

      {/* Main Goal */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Today's Main Goal</p>
        {isEditing ? (
          <input
            type="text"
            value={editedGoal}
            onChange={(e) => setEditedGoal(e.target.value)}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            placeholder="What is your main goal for today?"
          />
        ) : (
          <p className="text-xl font-medium text-white">{focus.mainGoal}</p>
        )}
      </div>

      {/* Energy Prediction */}
      <div className="mb-6">
        <p className="text-xs text-slate-500 uppercase tracking-wider mb-2">Predicted Energy</p>
        <div className="flex items-center gap-2">
          <Zap className={cn(
            "w-5 h-5",
            focus.energyPrediction === 'high' ? "text-emerald-400" :
            focus.energyPrediction === 'medium' ? "text-amber-400" : "text-slate-400"
          )} />
          <span className={cn(
            "font-medium",
            focus.energyPrediction === 'high' ? "text-emerald-400" :
            focus.energyPrediction === 'medium' ? "text-amber-400" : "text-slate-400"
          )}>
            {focus.energyPrediction === 'high' ? 'High Energy Day' :
             focus.energyPrediction === 'medium' ? 'Moderate Energy' : 'Low Energy Day'}
          </span>
        </div>
      </div>

      {/* Distractions to Avoid */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Shield className="w-4 h-4 text-rose-400" />
          <p className="text-xs text-slate-500 uppercase tracking-wider">Distractions to Avoid</p>
        </div>
        
        <div className="space-y-2">
          {isEditing ? (
            <>
              {editedDistractions.map((distraction, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-300 text-sm">
                    {distraction}
                  </span>
                  <button
                    onClick={() => removeDistraction(index)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newDistraction}
                  onChange={(e) => setNewDistraction(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addDistraction()}
                  placeholder="Add a distraction to avoid..."
                  className="flex-1 bg-slate-900/50 border border-slate-700 rounded-lg px-3 py-2 text-slate-200 text-sm focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={addDistraction}
                  className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 hover:bg-indigo-500/30"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </>
          ) : (
            <ul className="space-y-2">
              {focus.distractionsToAvoid.map((distraction, index) => (
                <li 
                  key={index}
                  className="flex items-center gap-3 text-slate-300 text-sm"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 flex-shrink-0" />
                  {distraction}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}