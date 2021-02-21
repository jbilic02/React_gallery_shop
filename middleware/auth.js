const jwt = require('jsonwebtoken')


//provjera jwt-a
const auth = (req,res,next) =>{
    try {
        const token = req.header("Authorization")// u request-u traži zaglavlje ‘authorization’
        if(!token) return res.status(400).json({msg: "Invalid authentification"})
        //Ukoliko ne uspije pronaći token, vraća odgovor 400.


        //Ukoliko je traženi token tu, u funckiju se salje token,secret i callback funkcija
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err,user) =>{
            if(err) return res.status(400).json({msg: "Invalid authentification"})//Ukoliko dođe do greške, vraća se 400

            req.user = user
            next()
            /*Budući da je funkcija verifyJwt() middleware, ukoliko se token uspješno verificira, poziva se next()funkcija
             kako bi se prešlo na sljedeći middleware koji je vezan za tu rutu.  */
        })
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}


module.exports = auth