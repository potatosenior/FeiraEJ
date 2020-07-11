const connection = require('../database/connection');

module.exports ={
    async create(request,response){
        const {Nome, CPF, Email, Senha, Endereco, Celular} = request.body;

        await connection('Cliente').insert({
            Nome,
            CPF,
            Email,
            Senha,
            Endereco,
            Celular
        });
        return response.json( { message : "Cliente cadastrado com sucesso"} );
    },

    async delete(request,response){
        const {CPF} = request.params;

        await connection('Cliente').delete('CPF').where('CPF',CPF);
        await connection('Carrinho').delete('CPF_fk').where('CPF_fk',CPF);

        return response.json( { message: "Cliente excluido com sucesso"} );
    }
}