import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import apiClient from '../../services/api';

const TransactionForm = () => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    category: '',
    type: 'despesa', // Default to expense
    date: new Date().toISOString().split('T')[0], // Default to today
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams(); // Get transaction ID from URL if editing
  const isEditing = Boolean(id);

  useEffect(() => {
    if (isEditing) {
      const fetchTransaction = async () => {
        setLoading(true);
        try {
          const res = await apiClient.get(`/transactions/${id}`); // Need a route to get single transaction
          // Assuming the backend route exists and returns the transaction
          const { description, amount, category, type, date } = res.data;
          setFormData({
            description,
            amount: Math.abs(amount), // Show positive amount in form
            category,
            type,
            date: new Date(date).toISOString().split('T')[0],
          });
        } catch (err) {
          console.error('Erro ao buscar transação para edição:', err);
          setError('Falha ao carregar dados da transação.');
        } finally {
          setLoading(false);
        }
      };
      // TODO: Implement GET /api/transactions/:id on backend first
      // fetchTransaction();
      console.warn("Edição: Rota GET /api/transactions/:id não implementada no backend ainda.");
      setLoading(false); // Remove this when backend route is ready
    }
  }, [id, isEditing]);

  const { description, amount, category, type, date } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Ensure amount is stored correctly (negative for despesa)
    const transactionData = {
      ...formData,
      amount: type === 'despesa' ? -Math.abs(amount) : Math.abs(amount),
    };

    try {
      if (isEditing) {
        await apiClient.put(`/transactions/${id}`, transactionData);
        console.log('Transação atualizada com sucesso');
      } else {
        await apiClient.post('/transactions', transactionData);
        console.log('Transação adicionada com sucesso');
      }
      navigate('/transacoes'); // Redirect to transaction list after submit
    } catch (err) {
      console.error('Erro ao salvar transação:', err.response ? err.response.data : err.message);
      const errorMsg = err.response && err.response.data && err.response.data.msg
                       ? (Array.isArray(err.response.data.msg) ? err.response.data.msg.join(', ') : err.response.data.msg)
                       : 'Erro ao salvar transação. Verifique os dados.';
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditing) return <div>Carregando transação...</div>;

  return (
    <div className="transaction-form">
      <h2>{isEditing ? 'Editar Transação' : 'Adicionar Nova Transação'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={onSubmit}>
        <div>
          <label htmlFor="description">Descrição:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={description}
            onChange={onChange}
            required
          />
        </div>
        <div>
          <label htmlFor="amount">Valor (R$):</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={amount}
            onChange={onChange}
            step="0.01"
            required
          />
        </div>
        <div>
          <label htmlFor="category">Categoria:</label>
          <input
            type="text"
            id="category"
            name="category"
            value={category}
            onChange={onChange}
            required
          />
          {/* TODO: Consider using a dropdown or datalist for categories */}
        </div>
        <div>
          <label htmlFor="type">Tipo:</label>
          <select id="type" name="type" value={type} onChange={onChange} required>
            <option value="despesa">Despesa</option>
            <option value="receita">Receita</option>
          </select>
        </div>
        <div>
          <label htmlFor="date">Data:</label>
          <input
            type="date"
            id="date"
            name="date"
            value={date}
            onChange={onChange}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Salvando...' : (isEditing ? 'Atualizar Transação' : 'Adicionar Transação')}
        </button>
        <button type="button" onClick={() => navigate('/transacoes')} disabled={loading}>
          Cancelar
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;

