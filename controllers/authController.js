import userService from '../services/userService.js'
import userDTO from '../DTO/userDTO.js'

const authRouter = {
    async login(req, res) {
        try {
            const userInDB = await userService.getUserByEmail(req.body.email);
    
            if (!userInDB) return res.status(401).json({ "message": "El correo o la contraseña son incorrectos." });
    
            const validPassword = userService.verifyPassword(req.body.password, userInDB.password);
    
            if (!validPassword) return res.status(401).json({ "message": "El correo o la contraseña son incorrectos." });
    
            const user = userDTO(userInDB);
    
            const token = userService.generateToken(user.email); 
    
            return res.status(200).json({
                "message": "Login successful.",
                "user": {
                    "fullName": user.name, 
                    "email": user.email
                },
                "token": token
            });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    },
    
    async register(req, res) {
        try {
            if (!req.body.password) {
                return res.status(400).json({ "message": "La contraseña es necesaria" });
            }
    
            const userInDB = await userService.getUserByEmail(req.body.email);
            if (userInDB) {
                return res.status(409).json({ "message": "Este email esta en uso" });
            }
    
            const newUser = await userService.createUser(req.body);
            const user = userDTO(newUser); 
    
            const token = userService.generateToken(user.email);
    
            return res.status(201).json({
                "message": "Sign Up successful.",
                "user": {
                    "fullName": user.name,
                    "email": user.email
                },
                "token": token
            });
        } catch (error) {
            return res.status(500).json({ "error": error.message });
        }
    },

    async verifyAccount(req, res) {
        try {
            if (req.query.id) {
                const user = await userService.update(req.query.id, { status: true })
                if (user.status) {
                    return res.status(200).json({ status: "ok" })
                } else {
                    return res.status(400).json({ message: "Error" })
                }
            }
        } catch (error) {
            return res.status(500).json({ error: error.messages })
        }
    },

    async loginWithToken(req, res) {
        const user = userDTO(req.user)
        return res.status(200).json({ "message": "Login successful.", user })
    },

    async generateApiKey(req, res) {
        try {
            const apiKey = userService.generateKey()
            const updateUser = userService.update(req.user._id, { apiKey })
            if (updateUser) {
                return res.status(201).json({ api_key: apiKey })
            }
            return res.status(400).json({ message: '' })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    },

    async getApiKey(req, res) {
        try {
            const user = await userService.getUserByEmail(req.user.email)
            res.status(200).json({ api_key: user.apiKey })
        } catch (error) {
            return res.status(500).json({ error: error.message })
        }
    }


}

export default authRouter

