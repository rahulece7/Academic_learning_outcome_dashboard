import React from 'react';
import FeatherIcon from './FeatherIcon';
import OutcomeCard from './OutcomeCard';
import './OutcomeList.css';

function OutcomeList({ outcomes, onEdit, onDelete }) {
  if (outcomes.length === 0) {
    return (
      <div className="empty-state">
        <h2><FeatherIcon name="fileText" size={20} /> No Learning Outcomes Yet</h2>
        <p>Click "Add Learning Outcome" to create your first outcome and start tracking progress!</p>
      </div>
    );
  }

  // Group outcomes by category
  const groupedOutcomes = outcomes.reduce((acc, outcome) => {
    const category = outcome.category || 'General';
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(outcome);
    return acc;
  }, {});

  return (
    <div className="outcome-list">
      {Object.entries(groupedOutcomes).map(([category, categoryOutcomes]) => (
        <div key={category} className="outcome-category">
          <h2 className="category-title">{category}</h2>
          <div className="outcomes-grid">
            {categoryOutcomes.map(outcome => (
              <OutcomeCard
                key={outcome.id}
                outcome={outcome}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default OutcomeList;
