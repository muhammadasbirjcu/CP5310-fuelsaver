export default {
    methods:{
        logoSource(make){
            let slugged = make.toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');
            return "/makes/" + slugged + ".png"
        }
    }
}