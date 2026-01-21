import React, { useState, useEffect } from 'react';

// Sistema de Gamificación - Gestión de puntos, niveles y logros
class GamificationSystem {
    constructor() {
        this.loadData();
    }

    loadData() {
        const saved = localStorage.getItem('gamification_data');
        if (saved) {
            const data = JSON.parse(saved);
            this.points = data.points || 0;
            this.level = data.level || 1;
            this.achievements = data.achievements || [];
            this.streak = data.streak || 0;
            this.lastVisit = data.lastVisit || null;
            this.stats = data.stats || {
                tasksCompleted: 0,
                breathingSessions: 0,
                journalEntries: 0,
                artSessions: 0,
                daysActive: 0
            };
        } else {
            this.points = 0;
            this.level = 1;
            this.achievements = [];
            this.streak = 0;
            this.lastVisit = null;
            this.stats = {
                tasksCompleted: 0,
                breathingSessions: 0,
                journalEntries: 0,
                artSessions: 0,
                daysActive: 0
            };
        }
        this.updateStreak();
    }

    saveData() {
        const data = {
            points: this.points,
            level: this.level,
            achievements: this.achievements,
            streak: this.streak,
            lastVisit: this.lastVisit,
            stats: this.stats
        };
        localStorage.setItem('gamification_data', JSON.stringify(data));
        
        // Disparar evento personalizado para que los componentes se actualicen
        window.dispatchEvent(new CustomEvent('gamification-update', { detail: data }));
    }

    updateStreak() {
        const today = new Date().toDateString();
        if (this.lastVisit) {
            const lastDate = new Date(this.lastVisit);
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (lastDate.toDateString() === today) {
                // Ya visitó hoy, mantener streak
                return;
            } else if (lastDate.toDateString() === yesterday.toDateString()) {
                // Visitó ayer, incrementar streak
                this.streak++;
                this.checkStreakAchievements();
            } else {
                // Rompió la racha
                this.streak = 1;
            }
        } else {
            this.streak = 1;
        }
        
        this.lastVisit = today;
        this.saveData();
    }

    addPoints(amount, reason) {
        this.points += amount;
        this.checkLevelUp();
        this.saveData();
        
        // Mostrar notificación de puntos
        this.showPointsNotification(amount, reason);
        
        return this.points;
    }

    checkLevelUp() {
        const pointsForNextLevel = this.level * 100;
        if (this.points >= pointsForNextLevel) {
            this.level++;
            this.unlockAchievement('level_' + this.level);
            this.showLevelUpNotification();
        }
    }

    unlockAchievement(achievementId) {
        if (!this.achievements.includes(achievementId)) {
            this.achievements.push(achievementId);
            this.saveData();
            this.showAchievementNotification(achievementId);
            return true;
        }
        return false;
    }

    checkStreakAchievements() {
        if (this.streak === 3) this.unlockAchievement('streak_3');
        if (this.streak === 7) this.unlockAchievement('streak_7');
        if (this.streak === 30) this.unlockAchievement('streak_30');
        if (this.streak === 100) this.unlockAchievement('streak_100');
    }

    // Acciones que otorgan puntos
    taskCompleted() {
        this.stats.tasksCompleted++;
        this.addPoints(10, 'Tarea completada');
        
        if (this.stats.tasksCompleted === 1) this.unlockAchievement('first_task');
        if (this.stats.tasksCompleted === 10) this.unlockAchievement('tasks_10');
        if (this.stats.tasksCompleted === 50) this.unlockAchievement('tasks_50');
        if (this.stats.tasksCompleted === 100) this.unlockAchievement('tasks_100');
        
        this.saveData();
    }

    breathingSessionCompleted() {
        this.stats.breathingSessions++;
        this.addPoints(5, 'Sesión de respiración');
        
        if (this.stats.breathingSessions === 1) this.unlockAchievement('first_breath');
        if (this.stats.breathingSessions === 10) this.unlockAchievement('breath_10');
        if (this.stats.breathingSessions === 50) this.unlockAchievement('breath_50');
        
        this.saveData();
    }

    journalEntryAdded() {
        this.stats.journalEntries++;
        this.addPoints(8, 'Entrada en diario');
        
        if (this.stats.journalEntries === 1) this.unlockAchievement('first_journal');
        if (this.stats.journalEntries === 10) this.unlockAchievement('journal_10');
        if (this.stats.journalEntries === 30) this.unlockAchievement('journal_30');
        
        this.saveData();
    }

    artSessionCompleted() {
        this.stats.artSessions++;
        this.addPoints(7, 'Sesión de arte');
        
        if (this.stats.artSessions === 1) this.unlockAchievement('first_art');
        if (this.stats.artSessions === 10) this.unlockAchievement('art_10');
        
        this.saveData();
    }

    showPointsNotification(amount, reason) {
        const event = new CustomEvent('show-toast', {
            detail: {
                type: 'points',
                message: `+${amount} puntos: ${reason}`,
                duration: 2000
            }
        });
        window.dispatchEvent(event);
    }

    showLevelUpNotification() {
        const event = new CustomEvent('show-toast', {
            detail: {
                type: 'levelup',
                message: `¡Nivel ${this.level}! 🎉`,
                duration: 3000
            }
        });
        window.dispatchEvent(event);
    }

    showAchievementNotification(achievementId) {
        const achievement = this.getAchievementInfo(achievementId);
        const event = new CustomEvent('show-toast', {
            detail: {
                type: 'achievement',
                message: `¡Logro desbloqueado: ${achievement.name}!`,
                icon: achievement.icon,
                duration: 3000
            }
        });
        window.dispatchEvent(event);
    }

    getAchievementInfo(id) {
        const achievements = {
            // Niveles
            'level_2': { name: 'Nivel 2', icon: '⭐', description: 'Alcanzaste el nivel 2' },
            'level_5': { name: 'Nivel 5', icon: '⭐⭐', description: 'Alcanzaste el nivel 5' },
            'level_10': { name: 'Nivel 10', icon: '⭐⭐⭐', description: 'Alcanzaste el nivel 10' },
            
            // Rachas
            'streak_3': { name: '3 Días Seguidos', icon: '🔥', description: '3 días de racha' },
            'streak_7': { name: 'Una Semana', icon: '🔥🔥', description: '7 días de racha' },
            'streak_30': { name: 'Un Mes', icon: '🔥🔥🔥', description: '30 días de racha' },
            'streak_100': { name: 'Centenario', icon: '💯', description: '100 días de racha' },
            
            // Tareas
            'first_task': { name: 'Primera Tarea', icon: '✅', description: 'Completaste tu primera tarea' },
            'tasks_10': { name: '10 Tareas', icon: '📝', description: '10 tareas completadas' },
            'tasks_50': { name: '50 Tareas', icon: '📋', description: '50 tareas completadas' },
            'tasks_100': { name: 'Centenar', icon: '💪', description: '100 tareas completadas' },
            
            // Respiración
            'first_breath': { name: 'Primera Respiración', icon: '🍃', description: 'Primera sesión de respiración' },
            'breath_10': { name: 'Respirador', icon: '🌬️', description: '10 sesiones de respiración' },
            'breath_50': { name: 'Maestro Zen', icon: '🧘', description: '50 sesiones de respiración' },
            
            // Diario
            'first_journal': { name: 'Primera Entrada', icon: '📖', description: 'Primera entrada en el diario' },
            'journal_10': { name: 'Escritor', icon: '✍️', description: '10 entradas en el diario' },
            'journal_30': { name: 'Cronista', icon: '📚', description: '30 entradas en el diario' },
            
            // Arte
            'first_art': { name: 'Primer Arte', icon: '🎨', description: 'Primera sesión de arte' },
            'art_10': { name: 'Artista', icon: '🖌️', description: '10 sesiones de arte' }
        };
        
        return achievements[id] || { name: 'Logro', icon: '🏆', description: 'Logro desbloqueado' };
    }

    getAllAchievements() {
        return [
            { id: 'first_task', category: 'Tareas' },
            { id: 'tasks_10', category: 'Tareas' },
            { id: 'tasks_50', category: 'Tareas' },
            { id: 'tasks_100', category: 'Tareas' },
            { id: 'first_breath', category: 'Bienestar' },
            { id: 'breath_10', category: 'Bienestar' },
            { id: 'breath_50', category: 'Bienestar' },
            { id: 'first_journal', category: 'Reflexión' },
            { id: 'journal_10', category: 'Reflexión' },
            { id: 'journal_30', category: 'Reflexión' },
            { id: 'first_art', category: 'Creatividad' },
            { id: 'art_10', category: 'Creatividad' },
            { id: 'streak_3', category: 'Rachas' },
            { id: 'streak_7', category: 'Rachas' },
            { id: 'streak_30', category: 'Rachas' },
            { id: 'streak_100', category: 'Rachas' }
        ].map(item => ({
            ...item,
            ...this.getAchievementInfo(item.id),
            unlocked: this.achievements.includes(item.id)
        }));
    }

    getProgress() {
        const pointsForNextLevel = this.level * 100;
        const pointsInCurrentLevel = this.points - ((this.level - 1) * 100);
        const progress = (pointsInCurrentLevel / pointsForNextLevel) * 100;
        
        return {
            level: this.level,
            points: this.points,
            streak: this.streak,
            achievements: this.achievements.length,
            progress: Math.min(progress, 100),
            pointsForNextLevel,
            stats: this.stats
        };
    }
}

// Instancia singleton
const gamification = new GamificationSystem();

export default gamification;
