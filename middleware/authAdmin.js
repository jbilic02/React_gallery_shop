const Users = require('../models/userModel')

const authAdmin = async (req, res, next) =>{
    try {
        //dohvacanje informacija o useru prema id
        const user = await Users.findOne({
            _id: req.user.id
        })
        if(user.role === 0) //ako je role = 1 za admina
            return res.status(400).json({msg: "Admin resources access denied"})

        next()//ukoliko se token uspješno verificira, poziva se next()funkcija kako bi se prešlo na sljedeći middleware koji je vezan za tu rutu
        
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

module.exports = authAdmin