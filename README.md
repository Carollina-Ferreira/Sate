Como jogar o código no git 
Para começar um trabalho:
git checkout develop
git pull origin develop
git checkout -b SEU-NOME/sua-tarefa

Exemplo:

git checkout develop
git pull origin develop
git checkout -b joao/flutter-atleta

Depois de fazer as alterações:

git add .
git commit -m "feat: descrição da alteração"
git push -u origin joao/flutter-atleta
