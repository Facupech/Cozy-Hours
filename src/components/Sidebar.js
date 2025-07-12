import React from 'react';
import './Sidebar.css';

export default function Sidebar({ onBack, onSelect }) {
  return (
    <div className="sidebar">
      <button className="back-button" onClick={onBack}>←</button>

      <div className="icon-buttons">
        <button className="icon yellow" onClick={() => onSelect('notes')} />
        <button className="icon red" onClick={() => onSelect('tasks')} />
        <button className="icon green" onClick={() => onSelect('pomodoro')} />
        <button className="icon blue" onClick={() => onSelect('relax')} />
      </div>
    </div>
  );
}
