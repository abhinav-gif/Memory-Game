app.use(express.json());
app.use(cors(
    {
        origin: ["http://localhost:3000"],
        origin: ["https://memory-game-sooty-ten.vercel.app"],
        credentials: true
    }
));
// Connect to MongoDB
mongoose.connect('mongodb+srv://17122000abhinav:1234@cluster0.qm6a1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
// User Registration
app.post('/api/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user = new User({ name, email, password: hashedPassword });
            await user.save();
            res.status(201).json({ message: 'User registered successfully', user: user });
        } else {
            return res.status(400).json({ error: 'User Already Registered' });
        }
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// User Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });
        res.status(200).json({ success: 'User Logged in Successfully', user: user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// Update User High Score
app.patch('/hiscore', async (req, res) => {
    try {
        const { id, score } = req.body;
        if (id !== 'undefined') {
            const user = await User.findById(id);
            if (!user) return res.status(404).json({ error: 'User not found' });

            if (score > user.highScore) {
                user.highScore = score;
                await user.save();
                res.json({ message: 'High score updated successfully', flag: true });
            } else {
                res.json({ message: 'No update needed; current score is higher' });
            }
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' })
    }
})

app.get('/hiscore', async (req, res) => {
    try {
        const id = req.query.id;
        if (id !== 'undefined') {
            const user = await User.findById(id)
            res.json(user.highScore);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: 'Server Error' });
    }
})

app.get('/leaderboard', async (req, res) => {
    try {
        const topUsers = await User.find()
            .sort({ highScore: -1 }) // Sort by highScore in descending order
            .limit(10)
            .select('name highScore');
        res.json(topUsers);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});
// Start server
app.listen(5000, () => {
    console.log('Server running on http://localhost:5000');
});
