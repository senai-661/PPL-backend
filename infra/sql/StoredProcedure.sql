LANGUAGE plpgsql
AS $$
BEGIN
    -- Validar nota
    IF p_nota < 1 OR p_nota > 5 THEN
        RAISE EXCEPTION 'Nota deve ser entre 1 e 5.';
    END IF;
 
    -- Validar se corrida existe
    IF NOT EXISTS (SELECT 1 FROM corrida WHERE id_corrida = p_id_corrida) THEN
        RAISE EXCEPTION 'Corrida não encontrada.';
    END IF;
 
    -- Validar se corrida pertence ao passageiro
    IF NOT EXISTS (
        SELECT 1 FROM corrida
        WHERE id_corrida = p_id_corrida AND id_passageiro = p_id_passageiro
    ) THEN
        RAISE EXCEPTION 'Você não tem permissão para avaliar esta corrida.';
    END IF;
 
    -- Validar se corrida foi finalizada
    IF NOT EXISTS (
        SELECT 1 FROM corrida
        WHERE id_corrida = p_id_corrida AND status_corrida = 'Finalizada'
    ) THEN
        RAISE EXCEPTION 'A corrida ainda não foi finalizada.';
    END IF;
 
    -- Validar se já foi avaliada
    IF EXISTS (SELECT 1 FROM avaliacao_corrida WHERE id_corrida = p_id_corrida) THEN
        RAISE EXCEPTION 'Essa corrida já foi avaliada.';
    END IF;
 
    -- Inserir avaliação
    INSERT INTO avaliacao_corrida (id_corrida, nota, comentario)
    VALUES (p_id_corrida, p_nota, p_comentario)
    RETURNING id_avaliacao INTO p_id_avaliacao;
END;
$$;