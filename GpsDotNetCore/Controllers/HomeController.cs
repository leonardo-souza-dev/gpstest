using Microsoft.AspNetCore.Mvc;

namespace Checkin.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
