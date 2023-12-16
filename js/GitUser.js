export class GitUser{
    static search(username){
        const endpoint = `https://api.github.com/users/${username}`

        return fetch(endpoint)
        .then(data => data.json())
        .then(({name, login, public_repos, followers}) => ({
            name,
            login,
            public_repos,
            followers
        }))
    }

}