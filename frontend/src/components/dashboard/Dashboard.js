import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    income: 0,
    expense: 0,
    transactionCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/dashboard');
        setDashboardData(res.data);
        setError('');
      } catch (err) {
        console.error('Erro ao buscar dados do dashboard:', err);
        setError('Falha ao carregar dados do dashboard. Por favor, tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Carregando dados do dashboard...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="dashboard">
      <h2>Dashboard Financeiro</h2>
      
      <div className="dashboard-summary">
        <div className="summary-card balance">
          <h3>Saldo Atual</h3>
          <p className="amount">R$ {dashboardData.balance}</p>
        </div>
        
        <div className="summary-card income">
          <h3>Receitas</h3>
          <p className="amount positive">R$ {dashboardData.income}</p>
        </div>
        
        <div className="summary-card expense">
          <h3>Despesas</h3>
          <p className="amount negative">R$ {dashboardData.expense}</p>
        </div>
        
        <div className="summary-card transactions">
          <h3>Transações</h3>
          <p className="count">{dashboardData.transactionCount}</p>
        </div>
      </div>
      
      <div className="dashboard-actions">
        <button onClick={() => window.location.href = '/transacoes'}>
          Ver Transações
        </button>
        <button onClick={() => window.location.href = '/transacoes/nova'}>
          Nova Transação
        </button>
      </div>
      
      {/* Aqui poderia ser adicionado um gráfico de transações recentes */}
      <div className="recent-activity">
        <h3>Atividade Recente</h3>
        <p>Implemente aqui um componente para mostrar as transações mais recentes</p>
      </div>
    </div>
  );
};

export default Dashboard;
