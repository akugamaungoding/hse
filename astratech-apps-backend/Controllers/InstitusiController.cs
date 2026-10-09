using astratech_apps_backend.DTOs.Institusi;
using astratech_apps_backend.DTOs.Institusi.Request;
using astratech_apps_backend.DTOs.Institusi.Response;
using astratech_apps_backend.Helpers;
using astratech_apps_backend.Repositories.Interfaces;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace astratech_apps_backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class InstitusiController(IInstitusiRepository repo, IMapper mapper) : ControllerBase
    {
        private readonly IInstitusiRepository _repo = repo;
        private readonly IMapper _mapper = mapper;
        private string? GetCurrentUsername() => User.FindFirstValue("namaakun");

        [HttpGet]
        [RequiresPermission("institusi.view")]
        public async Task<IActionResult> GetAll([FromQuery] GetAllInstitusiRequest dto)
        {
            var username = GetCurrentUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var (list, totalData) = await _repo.GetAllAsync(dto, username);

            var dataDTO = _mapper.Map<List<Institusi>>(list);

            var response = new GetAllInstitusiResponse
            {
                Data = dataDTO,
                TotalData = totalData,
                TotalHalaman = ((totalData - 1) / dto.PageSize) + 1
            };

            return Ok(response);
        }

        [HttpGet("{id}")]
        [RequiresPermission("institusi.view")]
        public async Task<IActionResult> GetById(short id)
        {
            var username = GetCurrentUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var dataDto = await _repo.GetByIdAsync(id, username);
            if (dataDto == null) return NotFound(new { message = "Data institusi tidak ditemukan." });

            return Ok(dataDto);
        }

        [HttpPost]
        [RequiresPermission("institusi.create")]
        public async Task<IActionResult> Create([FromBody] CreateInstitusiRequest dto)
        {
            var username = GetCurrentUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var newId = await _repo.CreateAsync(dto, username);

            return Ok(new { message = "Data institusi berhasil disimpan.", id = newId });
        }

        [HttpPut]
        [RequiresPermission("institusi.edit")]
        public async Task<IActionResult> Update([FromBody] UpdateInstitusiRequest dto)
        {
            var username = GetCurrentUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var success = await _repo.UpdateAsync(dto, username);
            if (!success) return NotFound(new { message = "Data institusi tidak ditemukan." });

            return Ok(new { message = "Data institusi berhasil disimpan." });
        }

        [HttpPatch("{id}/status")]
        [RequiresPermission("institusi.edit")]
        public async Task<IActionResult> SetStatus(short id)
        {
            var username = GetCurrentUsername();
            if (string.IsNullOrEmpty(username)) return Unauthorized();

            var success = await _repo.SetStatusAsync(id, username);
            if (!success) return NotFound(new { message = "Data institusi tidak ditemukan." });

            return Ok(new { message = "Data institusi berhasil disimpan." });
        }
    }
}
