function gcd(a, b)
{
  for (let temp = b; b !== 0;) { b = a % b; a = temp; temp = b; }
  return a;
}

function f_gcd(a,b)
{
  let s1 = dec_len(a);
  let s2 = dec_len(b);
  let s_fac = Math.pow(10, Math.min(Math.max(s1,s2)),4);

  let a1 = Math.round( a * s_fac ); 
  let b1 = Math.round( b * s_fac );

  return gcd(a1,b1)/s_fac;
}

function arr_gcd(list)
{ 
  let gcd_last = list[0];
  if(list.length<2){return gcd_last;}
  for(let i = 1; i<list.length;i++)
  {
    gcd_last = f_gcd(gcd_last,list[i]);
  }
  return gcd_last;
}

function f_lcm(a, b) 
{
  const gcdValue = f_gcd(a,b);

  return ( ((a) * (b)) / gcdValue ); 
}

function arr_lcm(list)
{ 
  let lcm_last = list[0];
  if(list.length<2){return lcm_last;}
  for(let i = 1; i<list.length;i++)
  {
    lcm_last = f_lcm(lcm_last,list[i]);
  }
  return lcm_last;
}

function dec_len(a)
{
  return a.toString().split('.')[1] && a.toString().split('.')[1].length||0;
}

