const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCtrl = {
    register:  async (req,res) =>{
        try {
            const {name, email, password} = req.body;

            const user = await Users.findOne({email}) //provjera postojanja usera
            if(user) return res.status(400).json({msg: "The email already exists."})

            if(password.length < 6) 
                return res.status(400).json({msg: "Password is at least 6 characters long."})
            
            //sifriranje lozinkom
            const passwordHash = await bcrypt.hash(password, 10)
            const newUser = new Users({
                name,email,password: passwordHash
            })
            
            //spremanje korisnika u mongodb
            await newUser.save()

            //stvaranje jsonwebtoken za autentifikaciju
            const acccestoken = createAccessToken({id: newUser._id})
            const refreshtoken = createRefreshToken({id: newUser._id})

            res.cookie('refreshtoken', refreshtoken, {
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({acccestoken})
            

        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    //ruta za login,provjera valjanosti emaila i sifre unesene te izdavanje tokena u slucaju valjanosti
    login: async (req,res) =>{ 
        try {
            const {email,password} = req.body;

            const user = await Users.findOne({email})
            if(!user) return res.status(400).json({msg: "User doesn't exist."})//ako korisnik nepostoji

            const isMatch = await bcrypt.compare(password, user.password)
            if(!isMatch) return res.status(400).json({msg: "Wrong password."})//kriva lozinka

            //ako je prijava uspjesna, kreiraj access token i refresh token 
            const acccestoken = createAccessToken({id: user._id})
            const refreshtoken = createRefreshToken({id: user._id})

            res.cookie('refreshtoken', refreshtoken, { //obicno imaju ogranicen vijek trajanja, na kraju se nalazi
                httpOnly: true,
                path: '/user/refresh_token'
            })

            res.json({acccestoken})// vraca se odgovor kao accresToken i podaci o useru (id)

        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    logout: async (req,res) =>{
        try {
            res.clearCookie('refreshtoken', {path: '/user/refresh_token'})
            return res.json({msg: "Logout"})
        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
    },
    refreshToken: (req,res) =>{
        try {
            const rf_token = req.cookies.refreshtoken;
            //res.json({rf_token})
            if(!rf_token) return res.status(400).json({msg: "Please Login or Register"})

            jwt.verify(rf_token, process.env.REFRESH_TOKEN_SECRET, (err,user) =>{
                if(err) return res.status(400).json({msg: "Please Login or Register"})
                
                const acccestoken = createAccessToken({id: user.id})
                
                res.json({acccestoken})
            })


        } catch (err) {
            return res.status(500).json({msg : err.message})
        }
        
    },
    getUser: async (req,res) =>{
        try {
            //id korisnika
            const user = await Users.findById(req.user.id).select('-password') //mice se password pri ispisu podataka usera, na postman, get dohvat priko tokena
            if(!user) return res.status(400).json({msg: "User doesnt exist"})

            res.json(user)//vrati unesenog korisnika
        } catch (err) {
            return res.status(500).json({msg: err.message})
            
        }
    },
    addCart: async (req, res) =>{
        try {
            const user = await Users.findById(req.user.id)
            if(!user) return res.status(400).json({msg: "Korisnik ne postoji."})

            await Users.findOneAndUpdate({_id: req.user.id}, {
                cart: req.body.cart
            })

            return res.json({msg: "Dodano u kosaricu"})
        } catch (err) {
            return res.status(500).json({msg: err.message})
        }
    }
}

//https://passwordsgenerator.net/ 
const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '1d'})

}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})

}


module.exports = userCtrl