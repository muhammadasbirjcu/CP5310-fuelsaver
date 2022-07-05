export default {
	methods: { 
        mpgTokpl(mpg){
            var kpl = parseFloat(mpg)/2.352;
            return Math.round(kpl*100)/100; // rounds off to 2 dec
        }
    }
}