

function homeController(){
    return{
        async index(req, res){
            return res.render('home')
        }
    }
}


module.exports = homeController