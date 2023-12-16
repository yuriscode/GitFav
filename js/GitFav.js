import { GitUser } from './GitUser.js'

export class Github{
    constructor(root){
        this.root = document.querySelector(root)
        this.load()
    }

    load(){
        this.entries = JSON.parse(localStorage.getItem('@gitfavs')) || []
    }

    save(){
        localStorage.setItem('@gitfavs', JSON.stringify(this.entries))
    }

    async add(username){
        try{
            
            const userExists = this.entries.find(entry => entry.login === username)
            
            if(userExists){
                throw new Error('Usuário já cadastrado')
            }

            const user = await GitUser.search(username)

            if(user === undefined){
                throw new Error ('Usuário não encontrado')
            }
            
            this.entries = [user, ...this.entries]
            this.update()
            this.save()

            } catch(error){
                alert(error.message)
        }

        
    }

    delete(user){
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login)

        this.entries = filteredEntries
        this.update()
        this.save()
    }

    
}

export class GithubView extends Github{
    constructor(root){
        super(root)

        this.tbody = document.querySelector('table tbody')

        this.update()
        this.onAdd()
    }

    onAdd(){
        const addButton = document.querySelector('.search button')

        window.onkeyup = event =>{
            if(event.key ==='Enter'){
                const { value } = this.root.querySelector(`.search input`)
                this.add(value)
            }
        }

        addButton.onclick = () =>{
            const { value } = this.root.querySelector(`.search input`)
            this.add(value)
        }
    }   

    update(){
        this.removeAllTr()
        this.emptyState()

        this.entries.forEach(user => {

            const row = this.createRow()

            row.querySelector('.user img').src = `https://github.com/${user.login}.png`
            row.querySelector('.user img').alt = `Imagem de {user.name}`
            row.querySelector('.user a').src = `https://github.com/${user.login}`
            row.querySelector('.user p').textContent = user.name
            row.querySelector('.user span').textContent = user.login
            row.querySelector('.repositories').textContent = user.public_repos
            row.querySelector('.followers').textContent = user.followers

            row.querySelector('.remove').onclick = () =>{
                const isOk = confirm('Tem certeza que deseja excluir essa linha?')
                if(isOk){
                    this.delete(user)
                }
            }


            this.tbody.append(row)
        })
    }

    createRow(){
        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
          <img src="https://github.com/maykbrito.png" alt="" />
          <a href="https://github.com/maykbrito">
            <p>Mayk Brito</p>
            <span>/maykbrito</span>
          </a>
        </td>
        <td class="repositories">123</td>
        <td class="followers">1234</td>
        <td class="remove"><button>Remover</button></td>
        `
        return tr;
    }

    removeAllTr(){

        this.tbody.querySelectorAll('tr')
        .forEach(tr => tr.remove())
    }

    emptyState() {
        if (this.entries.length === 0) {
            this.root.querySelector('.empty-state').classList.remove('hide')
        } else{
            this.root.querySelector('.empty-state').classList.add('hide')
        }
    }
}