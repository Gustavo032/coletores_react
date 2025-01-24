Estrutura do Sistema
1. Autenticação (Login/Logout)
Tela de Login:
Formulário com campos de email e senha.
Após o login bem-sucedido, armazenaremos o token JWT no localStorage ou sessionStorage para autenticação nas requisições subsequentes.
Após o login, o usuário será redirecionado à tela principal, onde verá as opções disponíveis de acordo com o seu papel.
Logout:
Um botão de logout na interface que, ao ser clicado, chamará o endpoint de logout no back-end e limpará o localStorage/sessionStorage para remover o token JWT.
2. Cadastro de Movimentações
Tela de Movimentação:
Formulário de Movimentação:
Campos:
Tipo de coletor (Botões de opção para "aud" ou "normal").
Modelo (Botões de opção para "CT45" ou "TC22").
ID do Coletor (Campo de input onde o usuário digita o número identificador).
Nome do colaborador responsável (Campo de input).
Botões de Ação: "Retirar" ou "Entregar" (dependendo do status atual do coletor).
O sistema preenche automaticamente o hostname com base nas escolhas do tipo, modelo e ID.
Validação: Antes de permitir a movimentação, o back-end garante que o coletor está disponível para a ação (se já foi retirado ou entregue, por exemplo).
O setor de origem será identificado automaticamente com base no login do usuário (isso vem do JWT do front-end).
O formulário envia as informações para o back-end via POST /movimentacoes.
3. Consulta e Relatórios do Histórico
Tela de Histórico:
Filtros em tempo real: O usuário poderá filtrar as movimentações com base em:
Setor de origem/destino
Data/hora
Status (entregue ou retirado)
Nome do colaborador
Modelo ou hostname do coletor
A pesquisa será feita automaticamente após 2 segundos de inatividade, chamando o endpoint GET /movimentacoes com os parâmetros de filtro.
Exibição de Movimentações:
As movimentações serão exibidas em uma tabela com colunas como:
Data e hora
Setor de origem
Setor de destino
Nome do colaborador responsável
Status
Modelo/hostname do coletor
As movimentações serão ordenadas pela data, com a mais recente primeiro.
Tela de Relatórios:
Gráficos sobre movimentações, como número de movimentações por setor ou por colaborador.
Filtros semelhantes aos da tela de histórico para gerar relatórios mais detalhados.
4. Gestão de Setores e Usuários
Tela de Setores:
Exibição de todos os setores com opções de adicionar, editar ou excluir setores.
Apenas administradores gerais ou de setor poderão gerenciar setores.
Tela de Usuários:
Exibição de todos os usuários com informações de permissões.
Os administradores poderão editar as permissões de usuários e definir os setores aos quais eles têm acesso.
Controle de Permissões:
Quando o usuário se autentica, a interface será renderizada de acordo com as permissões do usuário, ocultando ou exibindo funcionalidades específicas.
Por exemplo, usuários com permissões limitadas só poderão gerenciar movimentos no setor que estão autorizados, enquanto administradores gerais terão acesso total.
Tecnologias e Ferramentas a Serem Utilizadas:
1. React com TypeScript:
Utilizaremos React para o front-end, com TypeScript para garantir maior robustez e tipagem no desenvolvimento.
2. Material-UI:
Para uma interface visual rápida e estilizada, vamos utilizar o Material-UI, que é uma biblioteca de componentes pronta e responsiva.
Usaremos componentes como TextField, Button, Grid, Table, Select, Dialog, Snackbar e Card para compor as telas.
3. React Router:
Para navegar entre as diferentes telas do sistema, como Tela de Login, Tela de Movimentações, Histórico, Relatórios, etc.
4. Axios:
Para fazer requisições HTTP ao back-end. Utilizaremos Axios para todas as chamadas GET, POST, PUT, etc.
5. State Management (Context API ou Redux):
Para gerenciar o estado global (como o usuário autenticado, permissões, etc.), podemos usar a Context API ou Redux. Isso ajuda a passar dados de autenticação entre as telas sem precisar passar diretamente como props.
6. Chart.js ou Recharts:
Para gerar os gráficos nas telas de relatórios, utilizaremos o Chart.js ou Recharts, que permitem criar gráficos de barras, linhas, pizza, entre outros.
7. Hooks (useEffect, useState, useContext):
Vamos usar hooks como useState, useEffect e useContext para gerenciar o estado local e global, realizar efeitos colaterais como chamadas para o back-end e compartilhar dados entre componentes.
8. Responsividade:
O Material-UI já é responsivo por padrão, e podemos usar a grid system para garantir que as telas se ajustem bem a diferentes tamanhos de tela (mobile, tablet, desktop).
