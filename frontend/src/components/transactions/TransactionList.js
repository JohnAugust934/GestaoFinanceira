import React, { useState, useEffect } from 'react';
import apiClient from '../../services/api';
import { Link } from 'react-router-dom'; // Import Link for navigation

const TransactionList = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        setLoading(true);
        const res = await apiClient.get('/transactions');
        setTransactions(res.data);
        setError('');
      } catch (err) {
        console.error('Erro ao buscar transações:', err);
        setError('Falha ao carregar transações. Tente novamente.');
        // Handle specific errors like unauthorized (401) if needed
        if (err.response && err.response.status === 401) {
            // Redirect to login or show specific message
            setError('Sessão expirada ou inválida. Faça login novamente.');
            // Example: window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta transação?')) {
      try {
        await apiClient.delete(`/transactions/${id}`);
        setTransactions(transactions.filter(t => t._id !== id));
        console.log('Transação excluída com sucesso');
      } catch (err) {
        console.error('Erro ao excluir transação:', err);
        setError('Falha ao excluir transação.');
      }
    }
  };

  if (loading) return <div>Carregando transações...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div className="transaction-list">
      <h2>Lista de Transações</h2>
      <Link to="/transacoes/nova">Adicionar Nova Transação</Link>
      {transactions.length === 0 ? (
        <p>Nenhuma transação encontrada.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{new Date(transaction.date).toLocaleDateString()}</td>
                <td>{transaction.description}</td>
                <td>{transaction.category}</td>
                <td>{transaction.type}</td>
                <td style={{ color: transaction.type === 'receita' ? 'green' : 'red' }}>
                  R$ {transaction.amount.toFixed(2)}
                </td>
                <td>
                  {/* Link to edit page (to be created) */}
                  {/* <Link to={`/transacoes/editar/${transaction._id}`}>Editar</Link> */}
                  <button onClick={() => handleDelete(transaction._id)}>Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TransactionList;

